// test helpers

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { testDb } = require("../src/database/connect");

// Truncate all tables and restart identities for database
const cleanTables = () => {
    return testDb.transaction(trx =>
        trx.raw(
            `TRUNCATE
                users,
                facts,
                reports RESTART IDENTITY CASCADE`
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE users_user_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE facts_fact_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE reports_report_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('users_user_id_seq', 0)`),
                    trx.raw(`SELECT setval('facts_fact_id_seq', 0)`),
                    trx.raw(`SELECT setval('reports_report_id_seq', 0)`)
                ])
            )
    )
};

// Create dummy users
const makeUsers = () => {
    return [
        {
            user_id: 1,
            role: 'Admin',
            email: 'admin@dtf.gov',
            password: 'Password1!'
        },
        {
            user_id: 2,
            role: 'End-User',
            email: 'end-user@gmail.com',
            password: 'Password2!'
        }
    ];
};

// Create dummy facts
const makeFacts = () => {
    return [
        {
            fact_id: 1,
            title: 'The Sky is Blue',
            text: 'During the day',
            user_id: 2,
            status: 'Pending',
            date_submitted: '2020-06-01T01:55:48.000Z',
            serial: '055e7a36-d474-4769-aaab-4e37ae4a6a62'
        },
        {
            fact_id: 2,
            title: 'Grass is Orange',
            text: '',
            user_id: 2,
            status: 'Under Review',
            date_submitted: '2020-06-01T01:55:48.000Z',
            date_under_review: '2020-06-02T01:55:48.000Z',
            serial: '055e7a36-d474-4769-aaab-4e37ae4a6a62'
        },
        {
            fact_id: 3,
            title: 'Chocolate is sweet',
            text: 'Milk Chocolate',
            user_id: 2,
            status: 'Approved',
            date_submitted: '2020-06-01T01:55:48.000Z',
            date_under_review: '2020-06-02T01:55:48.000Z',
            date_approved: '2020-06-03T01:55:48.000Z',
            serial: '055e7a36-d474-4769-aaab-4e37ae4a6a62'
        },
        {
            fact_id: 4,
            title: 'The Moon is made of cheese',
            text: '',
            user_id: 2,
            status: 'Not True',
            date_submitted: '2020-06-01T01:55:48.000Z',
            date_under_review: '2020-02-05T01:55:48.000Z',
            date_not_true: '2020-06-03T01:55:48.000Z',
            serial: '055e7a36-d474-4769-aaab-4e37ae4a6a62'
        }
    ];
};

const makeReports = () => {
    return [
        {
            report_id: 1,
            fact_id: 1,
            date_created: '2020-06-06T00:00:00.000Z',
            report_status: 'Processing'
        },
        {
            report_id: 2,
            fact_id: 2,
            date_created: '2020-06-07T00:00:00.000Z',
            report_status: 'Processing'
        },
        {
            report_id: 3,
            fact_id: 3,
            date_created: '2020-06-08T00:00:00.000Z',
            report_status: 'Processing'
        }
    ]
};

const seedTables = (users, facts, reports) => {
    return testDb.transaction(async trx => {

        if (users.length > 0) {
            const preppedUsers = users.map((user) => ({
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
            await trx.raw(
                `SELECT setval('facts_fact_id_seq', ?)`,
                [facts[facts.length - 1].fact_id]
            );
        }

        if (reports.length > 0) {
            await trx.into('reports').insert(reports);
            await trx.raw(
                `SELECT setval('reports_report_id_seq', ?)`,
                [reports[reports.length - 1].report_id]
            );
        }

    });
};

const makeExpectedFact = fact => {
    return {
        fact_id: fact.fact_id,
        title: fact.title,
        text: fact.text,
        user_id: fact.user_id,
        status: fact.status,
        serial: '055e7a36-d474-4769-aaab-4e37ae4a6a62',
        date_submitted: fact.date_submitted,
        date_under_review: null,
        date_approved: null,
        date_not_true: null
    };
};

const makeExpectedReport = report => {
    return {
        report_id: report.report_id,
        fact_id: report.fact_id,
        date_created: report.date_created,
        report_status: report.report_status
    };
};

const makeMaliciousFact = person => {
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

const makeFixtures = () => {
    const testUsers = makeUsers();
    const testFacts = makeFacts();
    const testReports = makeReports();
    return {
        testUsers,
        testFacts,
        testReports
    };
};

const makeAuthHeader = (user, secret = process.env.JWT_SECRET) => {
    const token = jwt.sign(
        { user_id: user.user_id },
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
    seedTables,
    makeExpectedFact,
    makeFixtures
};
