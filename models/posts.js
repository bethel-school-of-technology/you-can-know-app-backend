'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Datatypes) => {
  const Posts = sequelize.define("posts", {
  // class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
  // posts: init({
    PostId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Datatypes.INTEGER
    },
    PostTitle: {
       type: Datatypes.STRING,
       allowNull: false,
    },
    
    PostBody: {
      type: Datatypes.TEXT,
      allowNull: false,
    },

    UserId: {
      type: Datatypes.INTEGER,
      allowNull: false,
    },
    Delete: {
      type: Datatypes.BOOLEAN,
      defaultValue: false,
    },
    Country: {
      type: Datatypes.STRING,
      allowNull: false,
  },
}, {
    sequelize,
    modelName: 'posts',
  });

return Posts;

};