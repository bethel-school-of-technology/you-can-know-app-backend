var express = require('express');
var router = express.Router();
// var models = require('../models');
var authService = require('../services/auth');

router.get('/createPost', function(req,res,next){
    res.json('posts', { title: 'Create a Post'});
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