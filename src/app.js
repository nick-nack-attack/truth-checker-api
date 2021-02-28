// main express root

/*
const express = require('express');
const app = express();
const errorHandler = require('./middleware/error-handler');

// configuration
require('dotenv').config();
const { NODE_ENV } = require('./config');
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// middleware
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// initialize middleware
app.use(errorHandler);
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

// routers 
const UsersRouter = require('./users/users-router');
const FactsRouter = require('./facts/facts-router');
const AuthRouter = require('./auth/auth-router');
const ReportsRouter = require('./reports/reports-router');

// routes
app.use('/api/users', UsersRouter);
app.use('/api/facts', FactsRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/reports', ReportsRouter);

// basic root path to confirm server is running
app.get('/', (req, res) => {
    res.status(200)
        .send(`This is the Department of Truth and Facts Api Service`)
});

module.exports = app;

*/
