'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('posts', [
      {
        title: '텐트',
        description: '좋은 텐트 있습니다',
	      brand: '헬리녹스',
	      price: 2000000,
	      image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
	      categoryId: null
      },{
        title: '코펠',
        description: '모든 요리가 맛있어집니다',
	      brand: '코오롱',
	      price: 50000,
	      image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
	      categoryId: null
      }, {
          title: '텐트',
        description: '감성캠핑용 텐트입니다',
        brand: '노르디스크',
        price: 2000000,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
	      categoryId: null
      },{
        title: '화로',
        description: '화력 대박입니다',
        brand: '힐맨',
        price: 100000,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
	      categoryId: null
      },{
        title: '조명',
        description: '은은한 분위기',
        brand: '노르디스크',
        price: 30000,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
	      categoryId: null
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('posts', null, {});
  },
};
