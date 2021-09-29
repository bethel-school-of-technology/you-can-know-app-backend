var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
    models.posts.findAll({}).then(posts => {
      res.json({
        status: 200,
        message:'successful',
        myPosts: posts
      });
    })
  });
  
  // Create new user if one doesn't exist
  router.post('/create', function(req, res, next) {
      console.log(req.body)
      let token = getToken(req);
      authService.verifyUser(token)
      .then(user => {
        models.posts
      .findOrCreate({
        where: {
          PostTitle: req.body.postTitle,
          PostBody: req.body.postBody,
          UserId: user.UserId
        },
      }).catch(e => console.log(e))
      .spread(function(result, created) {
        if (created) {
          res.send('Post successfully created');
        } else {
          res.send('This post already exists');
        }
      });
      }).catch(e => console.log(e))
    
  });


router.get('/', function(req, res, next) {
    res.json({message: "this works"})
    let token = getToken(req)
    authService.verifyUser(token)
    .token(user => {
        if(user) {
            models.posts.findAll({
            })
            .then(posts => {
                console.log(posts);
            })
        }
    })
    models.posts.findAll({}).then(posts => {
        console.log(posts);
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

module.exports = router;