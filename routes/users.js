var express = require('express');
var router = express.Router();
var models = require('../models'); //<--- Add models
var authService = require('../services/auth'); //<--- Add authentication service

/* GET users listing. */
router.get('/', function(req, res, next) {
  models.users.findAll({}).then(users => {
    res.json({
      status: 200,
      message:'successful',
      myUsers: users
    });
  })
});

// Create new user if one doesn't exist
router.post('/signup', function(req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: req.body.password
      }
    })
    .spread(function(result, created) {
      if (created) {
        res.send('User successfully created');
      } else {
        res.send('This user already exists');
      }
    });
});

// Login user and return JWT as cookie
router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username,
      Password: req.body.password
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    }
    if (user) {
      let token = authService.signUser(user); // <--- Uses the authService to create jwt token
      res.cookie('jwt', token); // <--- Adds token to response as a cookie
      res.send('Login successful');
    } else {
      console.log('Wrong password');
    }
  });
});

router.get('/profile', function (req, res, next) {
  let token = req.cookies.jwt;
  authService.verifyUser(token)
    .then(user => {
      if (user) {
        res.send(JSON.stringify(user));
      } else {
        res.status(401);
        res.send('Must be logged in');
      }
    })
});

module.exports = router;
