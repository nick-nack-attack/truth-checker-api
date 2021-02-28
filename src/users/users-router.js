// Users Router
const path              = require('path');
const express           = require('express');
const { Router }        = require('express');
const { requireAuth }   = require('../middleware/jwt-auth');
const UsersRouter       = Router();
const jsonParser        = express.json();

// service
const UsersService      = require('./users-service');

// creating users currently not supported.
// for testing purposes
UsersRouter
    .route('/')
    .get((req, res, next) => {


        return UsersService.getAllUsers()
          .then(listOfUsers => {
              res.json(listOfUsers.map(UsersService.serializeUser))
          })
          .catch(next)


    })

    .post(jsonParser, (req, res, next) => {
      const { role, email, password } = req.body;

      for (const field of ['role', 'email', 'password'])
        if (!req.body[field])
        return res
            .status(400)
            .json({
                error: `Missing ${field} in request body`
            });

        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            return res
                .status(400)
                .json({
                    error: passwordError
                });
        }

        UsersService.hasUserWithEmail(email)
        .then(hasUserWithEmail => {
          if (hasUserWithEmail)
            return res
                .status(400)
                .json({
                    error: `Email already exists`
                });

          return UsersService.hashPassword(password)
          .then(hashedPassword => {
              const newUser = {
                  role,
                  email,
                  password: hashedPassword,
                  date_created: 'now()',
              }

              return UsersService.insertUser(newUser)
              .then(user => {
                  res
                      .status(201)
                      .location(path.posix.join(req.originalUrl, `/${ user.user_id }`))
                      .json(UsersService.serializeUser(user));
              });
          });
        })
        .catch(next);
    });
    module.exports = UsersRouter;
