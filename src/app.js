// main express root
const express = require('express');
const app = express();

// configuration
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// middleware
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// routers 
const UsersRouter = require('./users/users-router');
const FactsRouter = require('./facts/facts-router');
const AuthRouter = require('./auth/auth-router');
const ReportsRouter = require('./reports/reports-router');



// initialize middleware
app.use(
  morgan(
    morganOption
  ),
  cors({
    origin: CLIENT_ORIGIN
  }),
  helmet()
);

// basic root path to confirm server is running
app.get('/', (req, res) => {
  res
    .status(200)  
    .send(`This is the Department of Truth and Facts Api Service`)
});

// routes
app.use('/api/users', UsersRouter);
app.use('/api/facts', FactsRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/reports', ReportsRouter);




 errorHandler = (error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
      response = { message: 'server error' }  // alt -> response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
 };

 app.use(errorHandler);

  module.exports = app;