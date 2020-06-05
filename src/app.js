require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { NODE_ENV } = require('./config');

const UsersRouter = require('./users/users-router');
const FactsRouter = require('./facts/facts-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/users', UsersRouter);
app.use('/api/facts', FactsRouter);

app.get('/', (req, res) => {
  res.send(`This is the Department of Truth and Facts Api Service`)
});

 app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { message: 'server error' }  // alt -> response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
  });

  module.exports = app;