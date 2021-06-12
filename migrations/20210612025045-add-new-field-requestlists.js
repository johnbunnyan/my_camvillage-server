'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('requestlists', 'userId', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('requestlists', 'userId');
  }
};