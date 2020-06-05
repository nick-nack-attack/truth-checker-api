const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');

describe(`facts endpoints`, () => {
    let db;
    // create db schema as JS objects
    const {
        testUsers,
        testFacts
    } = helpers.makeFixtures();
    // make knex instance
    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after(`disconnect from database`, () => {
        return db.destroy();
    });
    beforeEach(`truncate db and restart idents`, () => {
        return helpers.cleanTables(db);
    });
    afterEach(`truncate db and restart idents`, () => {
        return helpers.cleanTables(db);
    });

    describe(`GET /api/facts`, () => {
        context(`no facts in database`, () => {
            beforeEach('seed db', () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        []
                    )
                );
            });
            it(`responds 200 and empty array`, () => {
                return (
                    supertest(app)
                        .get(`/api/facts`)
                        
                )
            })
        })
    })

})