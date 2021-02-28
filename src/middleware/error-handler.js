// error handler
require('dotenv').config();
const { NODE_ENV } = require('../config');

const errorHandler = (error, req, res, next) => {
    let response;
    if (NODE_ENV === 'production') {
        response = { message: 'server error' }  // alt -> response = { error: { message: 'server error' } }
    } else {
        console.error('SOMETHING WENT WRONG!', error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
};

module.exports = errorHandler;