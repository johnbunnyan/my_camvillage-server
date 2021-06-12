'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      post.belongsToMany(models.user, {
        through: 'post_user'
      })
      post.belongsToMany(models.tag, {
        through: 'post_tag'
      })
      post.hasMany(models.requestlist, {
        foreignKey: 'postId'
      })
    }  

  };
  post.init({
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    brand: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'post',
  });


  return post;

};