const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const { expect } = require('chai');
const supertest = require('supertest');

describe(`reports endpoints`, () => {
    // set up db, knex instance, etc for tests
    let db;
    const { 
        testUsers, 
        testFacts, 
        testReports 
    } = helpers.makeFixtures();
    
    // run before and after clean-up and set-up
    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after(`disconnect from database`, () => {
        db.destroy()
    });
    beforeEach(`truncate db and restart idents`, () => {
        helpers.cleanTables(db)
    });
    afterEach(`truncate db and restart idents`, () => {
        helpers.cleanTables(db)
    });

    describe(`GET /api/reports`, () => {

        context(`no reports in database`, () => {

            beforeEach('seed db', () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        testFacts,
                        []
                    )
                );
            });

            it(`responds 200 and empty array`, () => {
                return (
                    supertest(app)
                        .get(`/api/reports`)
                        .expect(200, [])
                );
            });

        });

        context(`given there are reports`, () => {

            beforeEach('seed db', () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        testFacts,
                        testReports
                    )
                );
            });

            it(`responds with 200 and an array of reports`, () => {
                return (
                    supertest(app)
                        .get(`/api/reports`)
                        .expect(200, testReports)
                )        

            });

        });

    });

    describe(`PATCH /api/reports`, () => {

        beforeEach(`seed db`, () => {
            return (
                helpers.seedTables(
                    db,
                    testUsers,
                    testFacts,
                    testReports
                )
            );
        });

        context(`given report does not exist`, () => {

            it(`responds 404`, () => {
                const report_id = 1000;
                const updatedReport = {
                    report_status: 'Approved'
                };
                return (
                    supertest(app)
                        .patch(`/api/reports/id/${report_id}`)
                        .send(updatedReport)
                        .expect(404, {
                            error: `Report doesn't exist`
                        })
                );
            });

        })

        context(`given report does exist`, function() {

            it(`responds 200 and report is updated`, () => {
                this.retries(3);
                const report_id = 1;
                const updatedReport = {
                    report_status: 'Approved'
                };
                const expectedReport = {
                    ...testReports[report_id - 1],
                    updatedReport
                };
                return (
                    supertest(app)
                        .patch(`/api/reports/id/${report_id}`)
                        .send(updatedReport)
                        .expect(201)
                        .then(res => {
                            return (
                                supertest(app)
                                    .get(`/api/reports/id/${report_id}`)
                                    .expect(200)
                                    .expect(res => {
                                        expect(res.body.report_status).to.eql(expectedReport.report_status);
                                    })
                            )
                        })
                )
            })

        })

    })

});