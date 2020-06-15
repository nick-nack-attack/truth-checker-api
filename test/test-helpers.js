const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Truncate all tables and restart identities for database
function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
                users,
                facts RESTART IDENTITY CASCADE`
        )
        .then(() => 
            Promise.all([
                trx.raw(`ALTER SEQUENCE users_user_id_seq minvalue 0 START WITH 1`),
                trx.raw(`ALTER SEQUENCE facts_fact_id_seq minvalue 0 START WITH 1`),
                trx.raw(`SELECT setval('users_user_id_seq', 0)`),
                trx.raw(`SELECT setval('facts_fact_id_seq', 0)`)
            ])
        )
    );
};

// Create dummy users
function makeUsers() {
    return [
        {
            user_id: 1,
            role: 'Admin',
            email: 'admin@gmail.com',
            password: 'password'
        }, 
        {
            user_id: 2,
            role: 'End-User',
            email: 'end-user@gmail.com',
            password: 'password'
        }
    ];
};

// Create dummy facts
function makeFacts() {
    return [
        {
            fact_id: 1,
            user_id: 2,
            title: 'The Sky is Blue',
            text: 'During the day',
            status: 'Pending',
            date_submitted: '2020-06-01T01:55:48.000Z'
        }, 
        {
            fact_id: 2,
            user_id: 2,
            title: 'Grass is Orange',
            text: '',
            status: 'Under Review',
            date_submitted: '2020-06-01T01:55:48.000Z',
            date_under_review: '2020-06-02T01:55:48.000Z'
        }, 
        {
            fact_id: 3,
            user_id: 2,
            title: 'Chocolate is sweet',
            text: 'Milk Chocolate',
            status: 'Approved',
            date_submitted: '2020-06-01T01:55:48.000Z',
            date_under_review: '2020-06-02T01:55:48.000Z',
            date_approved: '2020-06-03T01:55:48.000Z'
        }, 
        {
            fact_id: 4,
            user_id: 2,
            title: 'The Moon is made of cheese',
            text: '',
            status: 'Not True',
            date_submitted: '2020-06-01T01:55:48.000Z',
            date_under_review: '2020-02-05T01:55:48.000Z',
            date_not_true: '2020-06-03T01:55:48.000Z'
        }
    ];
};

function seedTables(db, users, facts) {
    return db.transaction(async trx => {

        if (users.length > 0) {
            const preppedUsers = users.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }));
            await trx.into(`users`).insert(preppedUsers);
            await trx.raw(
                `SELECT setval('users_user_id_seq', ?)`,
                [users[users.length - 1].user_id]
            );
        }

        if (facts.length > 0) {
            await trx.into('facts').insert(facts);
            // await trx.raw(
            //     `SELECT setval('facts_fact_id_seq', ?)`,
            //     [facts[facts.length - 1].fact_id]
            // );
        }
        
    });
};

function makeExpectedFact(fact) {
    return {
        fact_id: fact.fact_id,
        title: fact.title,
        text: fact.text,
        user_id: fact.user_id,
        status: fact.status,
        date_submitted: fact.date_submitted,
        date_under_review: null,
        date_approved: null,
        date_not_true: null
    };
};

function makeMaliciousFact(person) {
    const maliciousFact = {
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        text: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        user_id: 2,
        date_submitted: new Date().toISOString()
    };
    const expectedFact = {
        ...makeExpectedFact([fact], maliciousFact),
        title: `Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;`,
        text: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };
    return {
        maliciousFact,
        expectedFact
    };
};

function makeFixtures() {
    const testUsers = makeUsers();
    const testFacts = makeFacts();
    return {
        testUsers,
        testFacts
    };
};

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        {user_id},
        secret,
            {
                subject: user.email,
                algorithm: 'HS256'
            }
    );
    return `Bearer ${token}`;
};

module.exports = {
    cleanTables,
    makeUsers,
    makeFacts,
    seedTables,
    makeExpectedFact,
    makeMaliciousFact,
    makeFixtures,
    makeAuthHeader
};