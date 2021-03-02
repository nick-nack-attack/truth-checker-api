const app = require('../src/server');
const helpers = require('./test-helpers');
const {expect} = require('chai');
const supertest = require('supertest');
const {testDb} = require("../src/database/connect");
const {describe} = require("mocha");

describe(`user endpoints`, () => {

    // initialize db
    let db;

    // create fixtures
    const {testUsers} = helpers.makeFixtures();
    const testUser = testUsers[0];

    // make knex instance
    before('make knex instance', () => {
        db = testDb
        app.set('db', db);
    })
    after(`disconnect from test db`, () => db.destroy());
    beforeEach(`truncate database and restart idents`, () => helpers.cleanTables());
    afterEach(`truncate db and restart idents`, () => helpers.cleanTables());

    describe(`GET /api/users`, () => {
        // context 1
        context(`no users in db`, () => {
            // set up db
            beforeEach(`seed db`, () =>
                helpers.seedTables(
                    [],
                    [],
                    [],
                )
            );
            // run tests
            it(`responds 200 and empty array`, () => {
                return (
                    supertest(app)
                        .get(`/api/users`)
                )
            })
        })
        // context 2
        context(`users in db`, () => {
            // set up db
            beforeEach('seed db', () => helpers.seedTables(testUsers, [], []))
            // run tests
            it(`responds 200 and users`, () => {
                return (
                    supertest(app)
                        .get(`/api/users`)
                        .expect(200)
                        .expect((res) => {
                            res.body.length === 2
                        })
                )
            });

        })

    })

    describe(`POST /api/users`, () => {

        context(`users ARE in db`, () => {

            beforeEach('seed db', () => helpers.seedTables(testUsers, [], []))

            context(`Something is missing in login credentials`, () => {
                const requiredFields = ['email', 'password'];

                requiredFields.forEach((field) => {

                    const registerAttemptBody = {
                        email: 'testuser@email.com',
                        password: 'password',
                    };

                    it(`responds error 400 and 'Missing ${field} in request body'`, () => {
                        delete registerAttemptBody[field];
                        return supertest(app)
                            .post('/api/users')
                            .send(registerAttemptBody)
                            .expect(
                                400,
                                {error: `Missing ${field} in request body`}
                            )
                    })

                });

            })

            it(`responds error 400 + 'Password must be longer than 8 characters'`, () => {
                const userShortPassword = {
                    role: 'End-User',
                    email: 'testuser@gmail.com',
                    password: '12345'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(
                        400,
                        {error: 'Password must be longer than 8 characters'}
                    )
            })

            it(`responds error 400 + 'Password cannot be longer than 72 characters'`, () => {
                const userLongPassword = {
                    role: 'End-User',
                    email: 'testuser@gmail.com',
                    password: '*'.repeat(100)
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(
                        400,
                        {error: 'Password cannot be longer than 72 characters'}
                    )
            })

            it(`responds error 400 + 'Password cannot start with a space'`, () => {
                const userPasswordStartsWithSpace = {
                    role: 'End-User',
                    email: 'testuser@gmail.com',
                    password: ' Password'
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsWithSpace)
                    .expect(
                        400,
                        {error: 'Password cannot start with a space'}
                    )
            })

            it(`responds error 400 + 'Password cannot end with a space'`, () => {
                const userPasswordEndsWithSpace = {
                    role: 'End-User',
                    email: 'testuser@gmail.com',
                    password: 'Password '
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsWithSpace)
                    .expect(
                        400,
                        {error: 'Password cannot end with a space'}
                    )
            })

            it(`responds error 400 + 'Email already exists'`, () => {
                const userExists = {
                    email: testUser.email,
                    password: testUser.password
                };
                return supertest(app)
                    .post('/api/users')
                    .send(userExists)
                    .expect(
                        400,
                        {error: 'Email already exists'}
                    )
            })

            it(`responds code 201 + serialized user + stored bcrypt password`, () => {
                // create a test user
                const newUser = {
                    email: `newUser@email.com`,
                    password: "A2jackjack!",
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect((res) => {
                        const expectedDate = new Date().toLocaleString(
                            'en',
                            {timeZone: 'UTC'},
                        );
                        const actualDate = new Date(res.body.date_created).toLocaleString(
                            'en',
                            {timeZone: 'UTC'},
                        );

                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(expectedDate).to.eql(actualDate)
                        expect(res.headers.location).to.eql(`/api/users/${res.body.user_id}`)

                        return supertest(app)
                            .get('/api/users')
                            .then((res) => {
                                expect(res.body[2]).to.include({email: `newUser@email.com`})
                            })
                    })
            })
        })
    });
})

