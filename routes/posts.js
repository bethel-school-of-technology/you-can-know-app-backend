var express = require('express');
var router = express.Router();
// var models = require('../models');
// var authService = require('../services/auth');

router.get('/createPost', function(req,res,next){
    res.render('posts', { title: 'Create a Post'});
});

module.exports = router;