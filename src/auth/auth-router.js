const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth');

const AuthRouter = express.Router();
const jsonBodyParser = express.json();

AuthRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { email, password } = req.body;
        const loginUser = { email, password };
        AuthService.checkAllFields(loginUser, res);
        AuthService.getUserWithEmail(
            req.app.get('db'),
            loginUser.email
        )
        .then(dbUser => {
            if (!dbUser) {
                return res.status(400).json({
                    error: `Couldn't find user with email ${loginUser.email}`
                })
            }
            return AuthService.comparePasswords(
                loginUser.password, dbUser.password
            )
            .then(result => {
                if (!result) {
                    return res.status(400).json({
                        error: `Incorrect Password`
                    })
                }
                try {
                    const sub = dbUser.email
                    const payload = { user_id: dbUser.user_id }
                    const user_id = dbUser.user_id
                    res.send({
                        authToken: AuthService.createJwt( sub, payload ),
                        user_id
                    })
                }
                catch(error) {
                    return res.send(500).json({ error: `Couldn't create JWTToken` })
                }
            })
        })
        .catch(error => {
            res.send(500).json({ error: `Couldn't create JWTToken` })
            next();
        })
    });

AuthRouter
    .post('/refresh', requireAuth, (req, res) => {
        const sub = req.user.email
        const payload = { user_id: req.user.user_id }
        const user_id = payload.user_id
            res.send({
                authToken: AuthService.createJwt(sub, payload),
                user_id
            })
    });

module.exports = AuthRouter;