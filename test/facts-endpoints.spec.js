const app           = require('../src/server');
const helpers       = require('./test-helpers');
const { testDb }    = require('../src/database/connect');
const { describe }  = require('mocha');
const { expect }    = require('chai');

describe.only(`facts endpoints`, () => {

    // initialize db
    let db = testDb;

    // create fixtures
    const { testUsers, testFacts } = helpers.makeFixtures();

    // make knex instance
    before(`make knex instance`, () => app.set('db', db) );
    after(`disconnect from test db`, () => db.destroy() );
    beforeEach(`truncate db and restart idents`, () => helpers.cleanTables() );
    afterEach(`truncate db and restart idents`, () => helpers.cleanTables() );

    describe(`GET /api/facts`, function() {

        context(`no facts in database`, function() {
            beforeEach('seed db', () => helpers.seedTables(testUsers, [], []) );

            it(`responds 200 + empty array`, function() {
                return supertest(app)
                    .get(`/api/facts`)
            });
        });

        context(`insert facts`, function() {
            beforeEach(`seed db`, () => helpers.seedTables(testUsers, testFacts, []) );

            it(`responds 200 + all facts`, function() {
                    return supertest(app)
                        .get(`/api/facts`)
                        .expect(200)
            });
        });
    });

    describe(`GET /api/facts/id/:fact_id`, function() {

        context(`given NO facts`, function() {
            beforeEach('seed db', () => helpers.seedTables(testUsers, [], []) );

            it(`responds with 404`, function() {
                return supertest(app)
                    .get(`/api/facts/id/1`)
                    .expect(404)
            });

        })

        context(`given there are facts`, function() {
            beforeEach(`seed db`, () => helpers.seedTables(testUsers, testFacts, []) );

            it(`responds 200 + all facts`, function() {
                supertest(app)
                    .get(`/api/facts`)
                    .expect(200)
                    .expect((res) => expect(res.body.length).to.eql(testFacts.length) )
            });
        });

    });

    describe(`POST /api/facts`, function() {

        context(`given NO facts`, function() {
            beforeEach('seed db', () => helpers.seedTables(testUsers, [], []) );

            it(`responds 201 + new fact`, function() {
                this.retries(3);
                const testUser = testUsers[0];
                const fact = {
                    title: "title",
	                user_id: testUser.user_id
                };

                return supertest(app)
                    .post(`/api/facts`)
                    .send(fact)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).to.have.property('fact_id');
                        expect(res.body.name).to.eql(fact.name);
                        expect(res.body.user_id).to.eql(testUser.user_id);
                        expect(res.headers.location).to.eql(`/api/facts/id/${res.body.fact_id}`);
                    })
            });

        });

        context(`given there ARE facts`, function() {
            beforeEach(`seed db`, () => helpers.seedTables(testUsers, testFacts, []) );

            it(`responds 201 + new fact`, function() {
                this.retries(5);
                const testUser = testUsers[0];
                const fact = {
                    title: "test fact",
	                user_id: 1
                };

                return supertest(app)
                    .post(`/api/facts`)
                    .send(fact)
                    .expect(201)
                    .expect((res) => {
                        expect(res.body).to.have.property('fact_id');
                        expect(res.body.name).to.eql(fact.name);
                        expect(res.body.user_id).to.eql(testUser.user_id);
                        expect(res.headers.location).to.eql(`/api/facts/id/${res.body.fact_id}`);
                    })
            });
        })

    });

    describe(`DELETE /api/facts/id/:fact_id`, function() {

        context(`given fact does NOT exist`, function() {
            beforeEach('seed db', () => helpers.seedTables(testUsers, [], []) );

            it(`responds 404`, function() {
                const fact_id = 1000;

                return supertest(app)
                    .delete(`/api/facts/id/${fact_id}`)
                    .expect(404, { error: `Fact doesn't exist` })
            });
        });

        context(`given fact DOES exist`, function() {
            beforeEach(`seed db`, () => helpers.seedTables(testUsers, testFacts, []) );

            it(`responds 204 + fact is deleted`, function() {
                const fact_id = 1;

                return supertest(app)
                    .delete(`/api/facts/id/${fact_id}`)
                    .expect(204)
                    .then(() => {
                        return supertest(app)
                            .get(`/api/facts/id/${fact_id}`)
                            .expect(404)
                    })
            });
        })
    });

    describe(`PATCH /api/facts/id/:fact_id`, function() {
        beforeEach(`seed db`, () => helpers.seedTables(testUsers, testFacts, []) );

        context(`given fact does NOT exist`, function() {
            it(`responds 404`, function() {
                const fact_id = 1000;
                const fact = {
                    title: 'New Title'
                };

                return supertest(app)
                    .patch(`/api/facts/id/${fact_id}`)
                    .send(fact)
                    .expect(404, { error: `Fact doesn't exist` })
            });
        });

        context(`given fact EXISTS`, function() {
            it(`responds 200 + fact is updated`, function() {
                this.retries(3);
                const fact_id = 1;
                const fact = {
                    title: 'New Title'
                };
                const expectedFact = {
                    ...testFacts[fact_id - 1],
                    ...fact,
                };

                return supertest(app)
                        .patch(`/api/facts/id/${fact_id}`)
                        .send(fact)
                        .expect(201)
                        .then((res) => {
                            return supertest(app)
                                .get(`/api/facts/id/${fact_id}`)
                                .expect(200)
                                .expect((res) => {
                                    expect(res.body.title).to.eql(expectedFact.title);

                                })
                        })
            });
        });
    });
});
