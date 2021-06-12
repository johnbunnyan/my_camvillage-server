'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('requestlists', [
      {
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        postId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        postId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        postId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('requestlists', null, {});
  },
};
