const express = require('express')
const path = require('path')
const UsersService = require('./users-service');

const UsersRouter = express.Router();
const jsonBodyParser = express.json();

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