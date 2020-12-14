// Users Router
const { Router } = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
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

    .post('/', (req, res, next) => {
      const { role, email, password } = req.body;

      for (const field of ['role', 'email', 'password'])
        if(!req.body[field])
        return res.status(400).json({
          error: `Missing ${field} in request body`
        });
      
        const passwordError = UsersService.validatePassword(password);
        if (passwordError)
          return res.status(400).json({ error: passwordError});

        UsersService.hasUserWithEmail(
          req.app.get('db'),
          email
        ) 
        .then(hasUserWithUserName => {
          if (hasUserWithUserName)
                  return res.status(400).json({ error: `Email already exists` });
          
          return UsersService.hashPassword(password)
          .then(hashedPassword => {
              const newUser = {
                  role,
                  email,
                  password: hashedPassword,
                  date_created: 'now()',
              }

              return UsersService.insertUser(
                  req.app.get('db'),
                  newUser
              )
              .then(user => {
                  res
                      .status(201)
                      .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
                      .json(UsersService.serializeUser(user));
              });
          });
        })
        .catch(next);
    });
    module.exports = UsersRouter;