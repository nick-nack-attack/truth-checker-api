// handles connecting to the database

// utilities
const { DATABASE_URL } = require('../config');
const knex =  require('knex');

// database
const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

const testDb = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
});

// boolean for if server is connected or not
let isConnected = false;
db.on('connected', () => { isConnected = true });

module.exports = {
    db,
    testDb,
    isConnected
};
