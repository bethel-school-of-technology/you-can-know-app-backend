'use strict';
module.exports = (sequelize, Datatypes) => {
  var users = sequelize.define (
    "users",
    {
      UserId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Datatypes.INTEGER
      },
      FirstName: Datatypes.STRING,
      LastName: Datatypes.STRING,
      Email: {
        type: Datatypes.STRING,
        unique: true
      },
      Username: {
        type: Datatypes.STRING,
        unique: true
      },
      UserBio: {
        type: Datatypes.TEXT,
        allowNull: true
        },
      Password: Datatypes.STRING,
      createdAt: Datatypes.DATE,
      updatedAt: Datatypes.DATE
    },
    // {}
  );

  
// Posts.associate = (models) => {
//   Posts.belongsTo(models.User, {

//   })
// }
  

  return users;
};
