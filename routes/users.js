var express = require("express");
const { sequelize } = require("../models");
var router = express.Router();
var models = require("../models"); //<--- Add models
var authService = require("../services/auth"); //<--- Add authentication service
/* GET users listing. */
router.get("/", function (req, res, next) {
  models.users.findAll({}).then((users) => {
    res.json({
      status: 200,
      message: "successful",
      myUsers: users,
    });
  });
});
// Create new user if one doesn't exist
router.post("/signup", function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username,
        FirstName: req.body.firstname,
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password), //<--- Change to this code here
      },
    })
    .spread(function (result, created) {
      if (created) {
        res.send({
          message: "created user",
          data: result,
        });
      } else {
        res.send({
          message: "user already exist!",
          data: result,
        });
      }
    });
});

// Create and Update UserBio if one doesn't exist
router.post("/postBio", function (req, res, next) {
  let token = getToken(req);

  authService
    .verifyUser(token)
    .then((user) => {
      models.users
        .update(
          { UserBio: req.body.userBio },
          {
            where: {
              UserId: user.UserId,
            },
          }
        )
        .catch((e) => console.log(`Error inserting new post`, e))
        .spread(function (result) {
          res.json({
            status: 200,
            message: "UserBio successfully created.",
            user: result,
          });
        });
    })
    .catch((e) => console.log(e));
});

// Login user and return JWT as cookie

router.post("/login", function (req, res, next) {
  models.users
    .findOne({
      where: {
        Username: req.body.username,
      },
    })
    .then((user) => {
      if (!user) {
        console.log("User not found");
        return res.status(401).json({ message: "Login Failed" });
      }
      if (user) {
        console.log(req.body.password);
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.Password
        );
        if (passwordMatch) {
          let token = authService.signUser(user); // <--- Uses the authService to create jwt token
          res.cookie("jwt", token); // <--- Adds token to response as a cookie
          res.json({
            message: "Login successful",
            status: 200,
            jwt: token,
          });
        } else {
          res.json({
            message: "Wrong Password",
            status: 404,
          });
        }
      }
    });
});
router.get("/profile", function (req, res, next) {
  let token = getToken(req);
  authService.verifyUser(token).then((user) => {
    if (user) {
      res.json({
        status: 200,
        message: `successful request`,
        user: user,
      });
    } else {
      res.status(401);
      res.send("Must be logged in");
    }
  });
});

router.get("/posts", function (req, res, next) {
  let token = getToken(req);

  authService.verifyUser(token).then((user) => {
    if (user) {
      models.posts
        .findAll({
          where: {
            UserId: user.UserId,
          },
          order: [['updatedAt', 'DESC']]
        })
        .then((posts) => {
          models.users.findAll({}).then((usersRes) => {
            res.json({
              status: 200,
              message: "successful",
              myPosts: posts,
              userInfo: user,
            });
          });
        });
    } else {
      res.status(401);
      res.send("Must be logged in");
    }
  });
});


// Create and Update UserBio if one doesn't exist
router.post("/posts", function (req, res, next) {
  let token = getToken(req);

  authService
    .verifyUser(token)
    .then((user) => {
      models.users
        .update(
          { myPosts: req.body.myPosts},
          {
            where: {
              UserId: user.UserId,
            },
          }
        )
        .catch((e) => console.log(`Error inserting new post`, e))
        .spread(function (result, created) {
          if (created) {
            res.json({
              status: 200,
              message: "UserPost successfully created.",
              user: result,
            });
          } else {
            res.send("This UserPost already exists");
          }
        });
    })
    .catch((e) => console.log(e));
});

// router.post("/postBio", function (req, res, next) {
//   let token = getToken(req);
//   authService.verifyUser(token).then((users) => {
//     if (users) {
//       models.users
//         .update({
//           where: {
//             UserId: users.UserId,
//           },
//         })
//         .then((users) => {
//           models.users.findOne({}).then((usersRes) => {
//             res.json({
//               status: 200,
//               message: "successful",
//               // myPosts: posts,
//               userInfo: user
//               // user: {
//               //   userbio: associatedUser.userbio,
//               // UserBio: userBio
//             });
//           });
//         });
//     } else {
//       res.status(401);
//       res.send("Must be logged in");
//     }
//   });
// });

router.get("/brazil", function (req, res, next) {
  models.posts
    .findAll({
      where: { Country: "Brazil" },
    })
    .then((posts) => {
      res.json({
        status: 200,
        message: "successful",
        myPosts: posts,
      });
    });
});

router.get("/greece", function (req, res, next) {
  models.posts
    .findAll({
      where: { Country: "Greece" },
    })
    .then((posts) => {
      res.json({
        status: 200,
        message: "successful",
        myPosts: posts,
      });
    });
});
router.get("/mexico", function (req, res, next) {
  models.posts
    .findAll({
      where: { Country: "Mexico" },
    })
    .then((posts) => {
      res.json({
        status: 200,
        message: "successful",
        myPosts: posts,
      });
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
