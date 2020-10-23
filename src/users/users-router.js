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

      UsersService.getAllUsers(req.app.get('db'))
        .then(listOfUsers => {
            res.json(listOfUsers.map(UsersService.serializeUser))
        })
        .catch(next)

    })
    .post(jsonBodyParser, (req, res, next) => {
      
      const { email, password } = req.body;

      const newUser = {
        email,
        password,
      }

      // if a value is missing from the request body then return error
      for (const [key, value] of Object.entries(newUser)) {
        if (value === undefined || value === null) {
          return res
            .status(400)
            .json({
              error: `Missing ${key} in request`
            })
        }
      }
      
      // check if email already exists
      UsersService.getUserEmail(
        req.app.get('db'), 
        email
      )
        .then(result => {
          if (!result.length) {
            res
              .status(400)
              .json({
                error: result
              })
          }
        })

    });
    
      // TO-DO:
      // check if password is valid .validatePassword
      // hash the password .encryptPassword
      // insert user .insertUser
      // api call to random user .fetchRandomUser
      // return user id, fake user info (201)

      // UsersService.createUser(req.app.get('db'), newUser);

    module.exports = UsersRouter;