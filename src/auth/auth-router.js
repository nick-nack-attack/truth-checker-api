// Authentication Router
const { Router, json } = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const jsonBodyParser = json();
const AuthRouter = Router();

// service
const AuthService = require('./auth-service');


AuthRouter
    .post('/login', jsonBodyParser, (req, res, next) => {

        const { email, password } = req.body;
        const loginUser = { email, password };

        // verify email and password are in request body
        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return (
                    res
                        .status(400)
                        .json({
                            error: `Missing ${key} in request body`
                        })
                );
            };
        };

        AuthService.getUserWithEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                // if the user doesn't exist, return error
                if (!dbUser) {
                    return res
                        .status(400)
                        .json({
                            error: `Incorrect email or password`
                        })
                }
                return AuthService.comparePasswords(
                    loginUser.password, dbUser.password
                )
                .then(result => {
                    // if request body password and db password don't match, return error
                    if (!result) {
                        return res
                            .status(400)
                            .json({
                                error: `Incorrect email or password`
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
                        return res
                            .send(500)
                            .json({ 
                                error: `Couldn't create JWTToken` 
                            })
                    }
                })
            })
            // handle error if present
            .catch(() => {
                res
                    .send(500)
                    .json({ 
                        error: `Couldn't create JWTToken` 
                    })
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