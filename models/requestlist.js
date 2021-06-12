'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requestlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      requestlist.belongsTo(models.post, {
        foreignKey: 'postId'
      })
    }
  };
  requestlist.init({
    confirmation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'requestlist',
  });
  return requestlist;
};