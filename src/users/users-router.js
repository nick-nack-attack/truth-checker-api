// Users Router
const { Router } = require('express');
const UsersRouter = Router();

// service
const UsersService = require('./users-service');

// creating users currently not supported.
// for testing purposes
UsersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(
            req.app.get('db')
        )
        .then(user => {
            res.json(user.map(UsersService.serializeUser))
        })
        .catch(next)
    })

    module.exports = UsersRouter;