'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('users', [
      {
        user_id: 'king',
        password: '1234',
        name: 'michael',
        email: 'jordan@authstates.com',
        nickname: 'airjordan',
        user_image: 'uploads/1629868331225-bezkoder-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        user_id: 'lightning',
        password: '5678',
        name: 'usain',
        email: 'bolt@authstates.com',
        nickname: 'bolt',
        user_image: 'uploads/1629868451229-bezkoder-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        user_id: 'faker',
        password: '1111',
        name: 'lee',
        email: 'faker@authstates.com',
        nickname: 'lol',
        user_image: 'uploads/1629868561572-bezkoder-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('users', null, {});
  },
};
