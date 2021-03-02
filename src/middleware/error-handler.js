// error handler
require('dotenv').config();
const { NODE_ENV } = require('../config');
const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
        response = { message: 'server error' }  // alt -> response = { error: { message: 'server error' } }
    } else {
        console.error('SOMETHING WENT WRONG!', error)
        response = { message: error.message, error }
        logger.error(error.message)
    }
    res.status(500).json(response);
};

module.exports = errorHandler;
