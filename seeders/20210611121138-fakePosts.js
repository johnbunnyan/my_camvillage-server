'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('posts', [
      {
        title: '텐트',
        category: '주거용품',
        description: '좋은 텐트 있습니다',
	      brand: '헬리녹스',
	      price: 2000000,
	      image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        title: '코펠',
        category: '주방용품',
        description: '모든 요리가 맛있어집니다',
	      brand: '코오롱',
	      price: 50000,
	      image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        title: '텐트',
        category: '주거용품',
        description: '감성캠핑용 텐트입니다',
        brand: '노르디스크',
        price: 2000000,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        title: '화로',
        category: '기타용품',
        description: '화력 대박입니다',
        brand: '힐맨',
        price: 100000,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        title: '조명',
        category: '기타용품',
        description: '은은한 분위기',
        brand: '노르디스크',
        price: 30000,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('posts', null, {});
  },
};
