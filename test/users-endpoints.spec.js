const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const { expect } = require('chai');
const supertest = require('supertest');

describe.only(`user endpoints`, () => {

    // initialize database
    let db;

    // create fixtures
    const { testUsers, testFacts } = helpers.makeFixtures();
    const testUser = testUsers[0];

    // make knex instance
    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    })
    after(`disconnect from db`, () => { db.destroy() });
    beforeEach(`truncate db and restart idents`, () => { helpers.cleanTables(db) });
    afterEach(`truncate db and restart idents`, () => { helpers.cleanTables(db) });

    describe(`GET /api/users`, () => {
        // context 1
        context(`no users in db`, () => {
            // set up db
            beforeEach(`seed db`, () => 
                helpers.seedTables(
                    db,
                    [],
                    [],
                    []
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
            beforeEach('seed db', () => helpers.seedTables( db, testUsers, [], [] ))
            // run tests
            it(`responds 200 and users`, () => {
                return (
                    supertest(app)
                        .get(`/api/users`)
                        .expect(200)
                        .expect(res => {
                            expect(res).length === 2
                        })
                )
            });
            
            })

        })

    describe(`POST /api/users`, () => {

        context(`users ARE in db`, () => {

            beforeEach('seed db', () => helpers.seedTables( db, testUsers, [], [] ))

            const requiredFields = ['email', 'password'];

            requiredFields.forEach(field => {

                const registerAttemptBody = {
                    email: 'testuser@email.com',
                    password: 'Password'
                };

                it(`responds error 400 and 'Missing ${field} in request body'`, () => {
                    delete registerAttemptBody[field];
                    return supertest(app)
                        .post('/api/user')
                        .send(registerAttemptBody)
                        .expect(
                            400,
                            { error: `Missing ${field} in request body` }
                        )
                })

            });

            it(`responds error 400 + 'Password must be longer than 8 characters'`, () => {
                const userShortPassword = {
                    email: 'testuser@gmail.com',
                    password: '12345'
                };
                return supertest(app)
                    .post('/api/user')
                    .send(userShortPassword)
                    .expect(
                        400,
                        { error: 'Password must be longer than 8 characters' }
                    )
            })

            it(`responds error 400 + 'Password cannot be longer than 72 characters'`, () => {
                const userLongPassword = {
                    email: 'testuser@gmail.com',
                    password: '*'.repeat(100)
                };
                return supertest(app)
                    .post('/api/user')
                    .send(userLongPassword)
                    .expect(
                        400,
                        { error: 'Password cannot be longer than 72 characters' }
                    )
            })

            it(`responds error 400 + 'Password cannot start with a space'`, () => {
                const userPasswordStartsWithSpace = {
                    email: 'testuser@gmail.com',
                    password: ' Password'
                };
                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordStartsWithSpace)
                    .expect(
                        400,
                        { error: 'Password cannot be longer than 72 characters' }
                    )
            })

            it(`responds error 400 + 'Password cannot end with a space'`, () => {
                const userPasswordEndsWithSpace = {
                    email: 'testuser@gmail.com',
                    password: 'Password '
                };
                return supertest(app)
                    .post('/api/user')
                    .send(userPasswordEndsWithSpace)
                    .expect(
                        400,
                        { error: 'Password cannot be longer than 72 characters' }
                    )
            })

            it(`responds error 400 + 'Email already exists'`, () => {
                const userExists = {
                    email: testUser.email,
                    password: testUser.password
                };
                return supertest(app)
                    .post('/api/user')
                    .send(userExists)
                    .expect(
                        400,
                        { error: 'Email already exists' }
                    )
            })

            it(`responds code 201 + serialized user + stored bcrypt password`, () => {
                // create a test user
                const newUser = {
                    role: 'End-User',
                    email: 'new_user@gmail.com',
                    password: 'Password'
                };
                const expectedDate = new Date().toLocaleString(
                    'en',
                    { timeZone: 'UTC' });
                const actualDate = new Date(res.body.date_created).toLocaleString(
                    'en',
                    { timeZone: 'UTC' });

                // expect the new user is returned
                return supertest(app)
                    .post(`/api/users`)
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('user_id')
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.user_id}`)
                        expect(expectedDate).to.eql(actualDate)
                    })
                    .expect(res => {
                        return db
                            .from('users')
                            .select('*')
                            .where({user_id: res.body.user_id})
                            .first()
                            .then(row => {
                                expect(row.email).to.eql(newUser.email)
                                expect(expectedDate).to.eql(actualDate)
                                return bcrypt.compare(
                                    newUser.password,
                                    row.password
                                )
                            })
                            .then(compareMatchedUsers => expect(compareMatchedUsers).to.be.true)
                    })

            })

        })
    });
})

