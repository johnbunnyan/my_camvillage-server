'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_user', {
      postId: {
        references: {
          key: 'id',
          model: 'post'
        },
        type: Sequelize.INTEGER
      },
      userId: {
        reference: {
          key: 'id',
          model: 'user'
        },
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
      await queryInterface.bulkInsert('post_user', [
      {
        postId: 1,
	      userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        postId: 3,
	      userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        postId: 2,
	      userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        postId: 4,
	      userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        postId: 5,
	      userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('post_user', null, {});
  },
};
