'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('requestlists', [
      {
        confirmation: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        postId: 1,
        userId: 'king'
      }, {
        confirmation: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        postId: 3,
        userId: 'lightning'
      },{
        confirmation: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        postId: 3,
        userId: 'lightning'
      },{
        confirmation: '0',
        createdAt: new Date(),
        updatedAt: new Date(),
        postId: 4,
        userId: 'faker'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('requestlists', null, {});
  },
};