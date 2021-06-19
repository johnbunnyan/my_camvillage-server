'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('mainslides', [
      {
        image: 'https://www.fetv.co.kr/data/photos/20201146/art_16049745713461_ef366b.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        image: 'https://cdnimage.ebn.co.kr/news/202006/news_1592895124_1439525_m_1.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        image: 'https://t1.daumcdn.net/cfile/tistory/99CEB433599100312F',
        createdAt: new Date(),
        updatedAt: new Date(),
      },{
        image: 'http://image.lotteimall.com/upload/display/planshop/5427532/reg_img_5427532_10.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('mainslides', null, {});
  },
};
