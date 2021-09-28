var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// // Route to Create a user

// router.post("/api/User", {req, res) => {
//   models.User.create({
//     email: req.body.email
//   })
//   .then((modelsUser) => {
//     res.json(modelsUser)
//   })
//   .catch((err) => res.status(422).json(err));
// });

// router.post("/api/User/all", (req, res) => {
//     models.User.findAll({}).then((usermodels) => {
//       res.json(usermodels);
//     });
//   });
      
// const getUser = (posts) => {
//     return models.User.findOne({
// where: { posts: posts },
// include: [ models.Posts, models.User],
//     }).then((res) => {
//       console.log(res);
//       return res;
//     });
//   }

// router.get("/api/User/:email", (req, res) => {
//   getUser(req.params.email).then((foundUser) => {
//     res.send(foundUser)
//   });
// });

module.exports = router;
