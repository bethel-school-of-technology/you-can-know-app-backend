var express = require("express");
const { sequelize } = require("../models");
var router = express.Router();
var models = require("../models"); //<--- Add models

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// http://localhost:3002/countries/brazil
router.get("/:countryName", function (request, response, next) {

    // GET /united-states-of-america
    models.posts
      .findAll({
        where: { Country: capitalize(request.params.countryName) }, // capitalize: brazil -> Brazil
      })
      .then((posts) => {
        response.json({
          status: 200,
          message: "successful",
          myPosts: posts,
        });
      });
  });
  

module.exports = router;