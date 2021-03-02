// server entry point

// use env file
require('dotenv').config();

const express = require('express');
const app     = express();

// utilities
const errorHandler = require('./middleware/error-handler');

// configuration
const { NODE_ENV, PORT }  = require('./config');
const morganOption        = NODE_ENV === 'production' ? 'tiny' : 'common';

// middleware
// const express = require('express');
const morgan  = require('morgan');
const cors    = require('cors');
const helmet  = require('helmet');

// create express server
// const app = express(); // const app = require('./app');

// initialize the middleware
app.use(errorHandler);
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

// routers
const UsersRouter   = require('./users/users-router');
const FactsRouter   = require('./facts/facts-router');
const AuthRouter    = require('./auth/auth-router');
const ReportsRouter = require('./reports/reports-router');

// initialize routes
app.use('/api/users', UsersRouter);
app.use('/api/facts', FactsRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/reports', ReportsRouter);

// "oven is hot" means "it's listening"
app.listen(PORT, () => {
  console.log(`The oven is hot on PORT ${PORT}`);
});

// basic root path to confirm server is running
app.get('/', (req, res) => {
  res
      .status(200)
      .send('This is the Department of Truth and Facts Api Service')
});

module.exports = app;
