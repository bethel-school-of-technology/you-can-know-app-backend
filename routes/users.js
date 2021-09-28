var express = require('express');
const { sequelize } = require('../models');
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
        Username: req.body.username,
        FirstName: req.body.firstname
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password) //<--- Change to this code here
      }
    })
    .spread(function(result, created) {
      if (created) {
        res.send({
          message: "created user",
          data: result
        });
      } else {
        res.send({
          message: "user already exist!",
          data: result
        });
      }
    });
});

// Login user and return JWT as cookie
router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.username,
    }
   
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({ message: "Login Failed" });
    }
    if (user) {
      console.log(req.body.password);
      let passwordMatch = authService.comparePasswords(req.body.password, user.Password);
      if(passwordMatch) {
        let token = authService.signUser(user); // <--- Uses the authService to create jwt token
        res.cookie('jwt', token); // <--- Adds token to response as a cookie
        res.json({
          message:'Login successful',
          status: 200,
          jwt: token
        });
      } else {
      res.json({
        message: 'Wrong Password',
        status: 404,
    });
      }
    }
  })
});

router.get('/profile', function (req, res, next) {
  let token = getToken(req);
  authService.verifyUser(token)
    .then(user => {
      if (user) {
        res.json({
          status: 200,
          message: `successful request`,
          user: user
        });
      } else {
        res.status(401);
        res.send('Must be logged in');
      }
    })
});
router.get('/posts', function (req, res, next) {
  let token = getToken(req);
  authService.verifyUser(token)
    .then(user => {
      if (user) {
        res.json({
          status: 200,
          message: `successful request`,
          user: user
        });
      } else {
        res.status(401);
        res.send('Must be logged in');
      }
    })
});

function getToken(req) {
  let headers = req.headers["authorization"];
  //console.log(headers);
  if (headers.startsWith("Bearer ")) {
    headers = headers.slice(7);
    console.log(headers);
  } else {
    return null;
  }
  return headers;
}

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define("User", {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   });


// User.associate = (models) => {
//   User.hasOne(models.User, { 
//     onDelete: "cascade"
//   });
//   User.hasMany(models.Posts, {
//     foreignKey: {
//       allowNull: false
//     }
//   });
// }

// return User 
// }


module.exports = router;
