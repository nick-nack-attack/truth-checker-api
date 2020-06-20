const app = require('../src/app');
const knex = require('knex');
const helpers = require('./test-helpers');
const { expect } = require('chai');

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
    after(`disconnect from database`, () => {db.destroy()});
    beforeEach(`truncate db and restart idents`, () => {helpers.cleanTables(db)});
    afterEach(`truncate db and restart idents`, () => {helpers.cleanTables(db)});

    describe(`GET /api/facts`, () => {

        context(`no facts in database`, () => {

            beforeEach('seed db', () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        [],
                        []
                    )
                );
            })

            it(`responds 200 + empty array`, () => {
                return (
                    supertest(app)
                        .get(`/api/facts`)                        
                );
            });

        });

        context(`insert facts`, () => {

            beforeEach(`seed db`, () => 
                helpers.seedTables(
                    db,
                    testUsers,
                    testFacts,
                    []
                )
            );

            it(`responds 200 + all facts`, () => {
                const expectedFacts =
                    testFacts
                        .filter(fact => fact.fact_id === testFacts[0].fact_id)
                        .map(fact => {
                            return (
                                helpers.makeExpectedFact(fact)
                            );
                        });
                        return (
                            supertest(app)
                                .get(`/api/facts/id/${testFacts[0].fact_id}`)
                                .expect(200, expectedFacts[0])
                                
                        );
            });

        });

    });

    describe(`GET /api/facts/id/:fact_id`, () => {
        
        context(`given NO facts`, () => {

            beforeEach(`seed db`, () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    [],
                    []
                )
            );

            it(`responds with 404`, () => {
                return (
                    supertest(app)
                        .get(`/api/facts/id/1`)
                        .expect(404, {
                            error: `Fact doesn't exist`
                        })
                );
            });



        })

        context(`given there are facts`, () => {

            beforeEach(`seed database`, () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testFacts,
                    []
                )
            );

            it(`responds 200 + specified fact`, () => {
                const fact_id = 1;
                const expectedFact = helpers.makeExpectedFact(testFacts[0]);
                return (
                    supertest(app)
                        .get(`/api/facts/id/${fact_id}`)
                        .expect(200, expectedFact)
                );
            });

        });

    });

    describe(`POST /api/facts`, () => {

        context(`given NO facts`, () => {

            beforeEach(`seed db`, () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        [],
                        []
                    )
                );
            });

            it(`responds 201 + new fact`, function() {
                this.retries(3);
                const testUser = testUsers[0];
                const fact = {
                    title: "title",
	                user_id: testUser.user_id
                };
                return (
                    supertest(app)
                        .post(`/api/facts`)
                        .send(fact)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('fact_id');
                            expect(res.body.name).to.eql(fact.name);
                            expect(res.body.user_id).to.eql(testUser.user_id);
                            expect(res.headers.location).to.eql(`/api/facts/id/${res.body.fact_id}`);
                            const expectedDateSubmitted  = new Date().toLocaleString();
                            const actualDatedSubmitted = new Date(res.body.date_submitted).toLocaleString();
                            expect(expectedDateSubmitted).to.eql(actualDatedSubmitted);
                        })
                );
            });

        });

        context(`given there ARE facts`, () => {

            beforeEach(`seed db`, () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        testFacts,
                        []
                    )
                );
            });

            it(`responds 201 + new fact`, function() {
                this.retries(5);
                const testUser = testUsers[0];
                const fact = {
                    // fact_id: 100,
                    title: "test fact",
	                user_id: 1
                };
                return (
                    supertest(app)
                        .post(`/api/facts`)
                        .send(fact)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('fact_id');
                            expect(res.body.name).to.eql(fact.name);
                            expect(res.body.user_id).to.eql(testUser.user_id);
                            expect(res.headers.location).to.eql(`/api/facts/id/${res.body.fact_id}`);
                            const expectedDateSubmitted  = new Date().toLocaleString();
                            const actualDatedSubmitted = new Date(res.body.date_submitted).toLocaleString();
                            expect(expectedDateSubmitted).to.eql(actualDatedSubmitted);
                        })
                );
            });

        })

    });

    describe(`DELETE /api/facts/id/:fact_id`, () => {

        context(`given fact does NOT exist`, () => {

            beforeEach(`seed db`, () => {
                return (
                    helpers.seedTables(
                        db,
                        [],
                        [],
                        []
                    )
                );
            });

            it(`responds 404`, () => {
                const fact_id = 1000;
                return (
                    supertest(app)
                        .delete(`/api/facts/id/${fact_id}`)
                        .expect(404, {
                            error: `Fact doesn't exist`
                        })
                );
            });

        });

        context(`given fact DOES exist`, () => {

            beforeEach(`seed db`, () => {
                return (
                    helpers.seedTables(
                        db,
                        testUsers,
                        testFacts,
                        []
                    )
                );
            });

            it(`responds 404 + person is deleted`, () => {
                const fact_id = 1;
                return (
                    supertest(app)
                        .delete(`/api/facts/id/${fact_id}`)
                        .expect(204)
                        .then(() => {
                            return (
                                supertest(app)
                                    .get(`/api/facts/id/${fact_id}`)
                                    .expect(404)
                            );
                        })
                );
            });

        })

    });

    describe(`PATCH /api/facts/id/:fact_id`, () => {

        beforeEach(`seed db`, () => {
            return (
                helpers.seedTables(
                    db,
                    testUsers,
                    testFacts,
                    []
                )
            );
        });

        context(`given fact does NOT exist`, () => {

            it(`responds 404`, () => {
                const fact_id = 1000;
                const fact = {
                    title: 'New Title'
                };
                return (
                    supertest(app)
                        .patch(`/api/facts/id/${fact_id}`)
                        .send(fact)
                        .expect(404, {
                            error: `Fact doesn't exist`
                        })
                );
            });

        });

        context(`given fact EXISTS`, function() {

            it(`responds 200 + fact is updated`, () => {
                this.retries(3);
                const fact_id = 1;
                const fact = {
                    title: 'New Title'
                };
                const expectedFact = {
                    ...testFacts[fact_id - 1],
                    ...fact,
                    //date_submitted: new Date(testFacts[fact_id - 1].date_created).toLocaleString()
                };
                return (
                    supertest(app)
                        .patch(`/api/facts/id/${fact_id}`)
                        .send(fact)
                        .expect(201)
                        .then(res => {
                            return (
                                supertest(app)
                                    .get(`/api/facts/id/${fact_id}`)
                                    .expect(200)
                                    .expect(res => {
                                        expect(res.body.title).to.eql(expectedFact.title);
                                        //const actualDatedSubmitted = new Date(res.body.date_submitted).toLocaleString();
                                        //expect(expectedFact.date_submitted).to.eql(actualDatedSubmitted).toLocaleString();
                                    })
                            );
                        })
                );
            });

        });

    });

});