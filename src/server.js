// Server entry point
const app = require('./app');

// Configuration
require('dotenv').config();
const { PORT, DATABASE_URL } = require('./config');

// Utilities
const knex = require('knex');

// Database
const db = knex({
    client: 'pg',
    connection: DATABASE_URL
  });

// Global variables
app.set('db', db);

// Oven is hot means it's listening
app.listen(PORT, () => console.log(`The oven is hot on ${PORT}`));