'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_tag', {
      postId: {
        references: {
          key: 'id',
          model: 'post'
        },
        type: Sequelize.INTEGER
      },
      tagId: {
        reference: {
          key: 'id',
          model: 'tag'
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
      await queryInterface.bulkInsert('post_tag', [
      {
        postId: 1,
	      tagId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        postId: 1,
	      tagId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        postId: 3,
	      tagId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        postId: 4,
	      tagId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        postId: 5,
	      tagId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('post_tag', null, {});
  },
};
