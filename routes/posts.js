var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  models.posts
    .findAll({
      // include: [
      //  {
      //   model: models.users,
      //   required: true
      //  }
      // ]
    })
    .then((posts) => {
      // Retrieve all users
      const postArray = [];
      posts.forEach((post) => postArray.push(post.dataValues));

      models.users.findAll({}).then((users) => {
        const usersArray = [];
        users.forEach((user) => usersArray.push(user));

        res.json({
          status: 200,
          message: "successful",
          myPosts: postArray.map((post) => {
            const associatedUser = usersArray.find(
              (user) => user.UserId === post.UserId
            );
            return {
              PostTitle: post.PostTitle,
              PostBody: post.PostBody,
              Country: post.Country,
              createdAt: post.createdAt,
              user: {
                FirstName: associatedUser.FirstName,
                LastName: associatedUser.LastName,
              },
            };
          }),
        });
      });
    });
});

// Create new user if one doesn't exist
router.post("/create", function (req, res, next) {
  let token = getToken(req);
  authService
    .verifyUser(token)
    .then((user) => {
      models.posts
        .findOrCreate({
          where: {
            Country: req.body.Country,
            PostTitle: req.body.PostTitle,
            PostBody: req.body.PostBody,
            UserId: user.UserId,
          },
        })
        .catch((e) => console.log(`Error inserting new post`, e))
        .spread(function (result, created) {
          if (created) {
            res.json({
              status: 200,
              message: "Post successfully created.",
              post: result,
            });
          } else {
            res.send("This post already exists");
          }
        });
    })
    .catch((e) => console.log(e));
});

router.get("/", function (req, res, next) {
  res.json({ message: "this works" });
  let token = getToken(req);
  authService.verifyUser(token).token((user) => {
    if (user) {
      models.posts.findAll({}).then((posts) => {
        console.log(posts);
      });
    }
  });
  models.posts.findAll({}).then((posts) => {
    console.log(posts);
  });
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
