const { user, post, mainslide } = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다
const sequelize = require('sequelize');
const Op = sequelize.Op

const { QueryTypes } = require('sequelize');

const db = require('../models/index');

const {isAuthorized,//토큰 있는지 없는지 확인
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
  resendAccessToken,
  checkRefeshToken

} =require('./tokenMethod');

module.exports = {
  
  mainpageController: (req, res) => {
    mainslide.findAll({
      


    })
  },
  searchController: async (req, res) => {

    const { category, queryString } = req.body;

    const searchWord = await db.sequelize.query(
      `select * from posts
      where posts.title like :searchWord`, {
        replacements: {searchWord: queryString},
        type: QueryTypes.SELECT
      }
    )
    if(searchWord){
      res.status(200).send(searchWord)
    } else {
      res.status(400).send('error message');
    }

    if(category === 'nickname'){

    }
    // const searchInfo = await db.sequelize.query(
    //    `select * from users
    //    where users.nickname like :searchWord` , {
    //      replacements: {searchWord: req.body.searchWord},
    //      type: QueryTypes.SELECT
    //    }
    // )
    // if(searchInfo){
    //   res.status(200).send(searchInfo);
    // } else {
    //   res.status(400).send('error message')
    // }

    //  /search?searchType=nickname&searchWord=jordan
    // const { searchType, searchWord } = req.body;
    // if(searchType === 'nickname'){
    //   post.findAll({
    //     where: {
    //       // Select * from post
    //       // left join post_user on posts.id = post_user.postId
    //       // left join users on post_user.userId = users.id
    //       // where users.nickname = searchWord
    //       searchWord: users.nickname    
    //     },
    //     include: [{
    //       model: users,
    //       required: false,
    //     }, {
    //       model: post_user,
    //       required: false
    //     }]
    //   })
    // } else if(searchType === 'hashtag'){
    //   post.findAll({
    //       // Select * from post
    //       // left join post_tag on posts.id = post_tag.postId
    //       // left join tags on post_tag.tagId = tags.id
    //       // where tags.name = searchWord        
    //   })
    // } else {
    //   post.findAll({
    //     where: {
    //       title: {
    //         [Op.like]: '%' + searchWord + '%'
    //       }
    //     }
    //   })
    //   .then(result => {
    //     res.status(200).send(result)
    //   })
    //   .catch(err => {
    //     res.status(500).send('err')
    //   })
    // }

    

  }
};