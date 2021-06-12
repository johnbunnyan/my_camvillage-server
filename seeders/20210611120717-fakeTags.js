'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('tags', [
      {
        name: '감성캠핑',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: '장비',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        id: 3,
        name: '텐트',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('tags', null, {});
  },
};
