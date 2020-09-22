// server entry point
require('dotenv').config();
const app = require('./app');

// configuration
const {
   PORT, 
   DATABASE_URL 
  } = require('./config');

// utilities
const knex = require('knex');

// database
const db = knex({
    client: 'pg',
    connection: DATABASE_URL
  });

// global variables
app.set('db', db);

// "oven is hot" means "it's listening"
app.listen(PORT, () => {
  console.log(`The oven is hot on PORT ${PORT}`);
});