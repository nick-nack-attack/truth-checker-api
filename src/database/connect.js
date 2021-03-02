// handles connecting to the database

// utilities
const { NODE_ENV, DATABASE_URL, TEST_DATABASE_URL }     = require('../config');
const knex                                              = require('knex');

// database
const db = knex({
    client: 'pg',
    connection: NODE_ENV === 'test' ? TEST_DATABASE_URL : DATABASE_URL,
});

const testDb = knex({
    client: 'pg',
    connection: TEST_DATABASE_URL,
});

// boolean for if server is connected or not
let isConnected = false;

db.on('connected', function() { isConnected = true });

module.exports = { db, testDb, isConnected }

