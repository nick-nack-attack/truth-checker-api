const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const { expect } = require('chai');
const supertest = require('supertest');

describe(`user endpoints`, () => {
    // initialize database
    let db;
    // create fixtures
    const { testUsers, testFacts } = helpers.makeFixtures();
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
            beforeEach('seed db', () => helpers.seedTables( db, testUsers, [] ))
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
    })

