var express = require('express');
var router = express.Router();
var models = require('../models');
var authService = require('../services/auth');

router.get('/createPost', function(req,res,next){
    res.render('posts', { title: 'Create a Post'});
});

router.post('/createPost', function(req,res,next) {
    let token = req.cookies.jwt;
    models.users
    authService.verifyUser(token).then(user => {
        if(user) {
            models.posts
            .findOrCreate({
                where: {
                    UserId: user.UserId,
                    PostTitle: req.body.postTitle,
                    PostBody: req.body.postBody
                }
            })
        .spread(function (result, created) {
            if (created) {
                res.redirect('/users/profile');
            }
            else {
                res.send('Post failed to create.');
            }
        })
        }
    });
});

//
router.get('/editPost/:id', function(req,res,next){
    let token = req.cookies.jwt;   
    if(token){
        authService.verifyUser(token)
        .then(user => {
        if(user){
            models.posts.findOne({
                where: {PostId:req.params.id}
            })
        .then(postDataFound => {
        // console.log(postDataFound);
         res.render('editPost', {
            userData: postDataFound,
            PostId: postDataFound.PostId,
            PostTitle: postDataFound.PostTitle,
            PostBody: postDataFound.PostBody            
        });   
        })
        } else {
            res.send('please log in')
        }   
        
        })
    }   else{
        res.send('not authorized!')
    }
});

//update a post
router.post('/editPost/:id', function (req,res,next) {
    let postId = parseInt(req.params.id);
    models.posts
    .update({PostTitle: req.body.postTitle, PostBody: req.body.postBody},
        {where: { PostId: postId}})
    // .update(req.body, {where: {PostId: postId}})
    .then(result => res.redirect('/users/profile'))
    .catch (err => {
        res.status(400);
        res.send('There was a problem with updating the post');
    });
});

//delete post selected
router.post('/deletePost/:id', function (req,res,next) {
    let postId = parseInt(req.params.id);
    models.posts
    .destroy({where: { PostId: postId}})
    .then(result => res.redirect('/users/profile'))
    .catch (err => {
        res.status(400);
        res.send('There was a problem with deleting the post');
    });
});

module.exports = router;