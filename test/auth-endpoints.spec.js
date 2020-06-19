const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const supertest = require('supertest');
const config = require('../src/config');

describe(`auth endpoints`, () => {
    // initialize db
    let db;
    // create fixtures
    const { testUsers } = helpers.makeFixtures();
    const testUser = testUsers[0];
    // set up before and after connection and clean up
    before(`make db connection`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after(`disconnect from db`, () => {
        return db.destroy();
    });
    before(`truncate db and restart idents`, () => {
        return helpers.cleanTables(db);
    });
    afterEach(`truncate db and restart idents`, () => {
        return helpers.cleanTables(db);
    });

    describe(`POST /api/auth/login`, () => {
        // set up users before login
        beforeEach(`insert users`, () => {
            return (
                helpers.seedTables(
                    db,
                    testUsers,
                    [],
                    []
                )
            );  
        });

        const requiredFields = ['email', 'password'];

        requiredFields.forEach(field => {

            const loginAttemptBody = {
                email: testUser.email,
                password: testUser.password
            };

            it(`responds 400 'required' when ${field} is missing`, () => {
                delete loginAttemptBody[field];
                return (
                    supertest(app)
                        .post(`/api/auth/login`)
                        .send(loginAttemptBody)
                        .expect(400, {
                            error: `Missing ${field} in request body`
                        })
                );
            });

        });

        it(`responds 400 'invalid email or password' when bad email exists`, () => {
            const userInvalidEmail = { email: 'not-a-user@email.com', password: 'wrong' };
            return (
                supertest(app)
                    .post(`/api/auth/login`)
                    .send(userInvalidEmail)
                    .expect(400, {
                        error: `Incorrect email or password`
                    })
            );
        });

        it(`responds 400 'invalid email or password' when bad password exists`, () => {
            const userInvalidPass = { email: testUser.email, password: 'wrong' };
            return (
                supertest(app)
                    .post(`/api/auth/login`)
                    .send(userInvalidPass)
                    .expect(400, {
                        error: `Incorrect email or password`
                    })
            );
        });

        it(`responds 200 and JWT auth token using secret when valid creds`, () => {
            const validUserCreds = {
                email: testUser.email,
                password: testUser.password
            };
            const expectedToken = jwt.sign(
                { user_id: testUser.user_id }, // payload
                config.JWT_SECRET,
                {
                    subject: testUser.email,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256'
                }
            );
            return (
                supertest(app)
                    .post(`/api/auth/login`)
                    .send(validUserCreds)
                    .expect(200, {
                        authToken: expectedToken,
                        user_id: testUser.user_id
                    })
            );
        });

    });

});