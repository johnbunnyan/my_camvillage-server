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
      attributes: ['image']
    })
    .then(result => {
      res.status(200).send(result); // result 배열로 전송
      console.log(result[0].dataValues.image)
    })
    .catch(err => {
      res.status(400).send('error')
    })
    
  },

  searchController: async (req, res) => {
   


    const { category, queryString } = req.body;

    if(category === 'title'){
      const searchWord = await db.sequelize.query(
        `select posts.id, posts.title, posts.category, posts.description,
        posts.brand, posts.price, posts.image, users.nickname, users.user_image from posts, users
        where posts.title like :searchWord`, {
          replacements: {searchWord: queryString},
          type: QueryTypes.SELECT
        }
      )
      console.log(searchWord);
      if(searchWord){
        res.status(200).send(searchWord) // searchWord는 배열로 들어감 -> 배열 안에 요소가 객체 (posts의 정보가 있음)
      } else {
        res.status(400).send('error message');
      }
    } else if(category === 'nickname'){
      const searchNickname = await db.sequelize.query(
        `select posts.id, posts.title, posts.category, posts.description,
        posts.brand, posts.price, posts.image, users.nickname, users.user_image from posts, users
        join post_user on posts.id = post_user.postId
        join users on post_user.userId = users.id
        where users.nickname like :searchNickname`, {
          replacements: {searchNickname: queryString},
          type: QueryTypes.SELECT
        }
      )
      if(searchNickname){
        res.status(200).send(searchNickname)
      } else {
        res.status(400).send('error message');
      }
    } else if(category === 'hashtag'){
      const searchHashtag = await db.sequelize.query(
        `select posts.id, posts.title, posts.category, posts.description,
        posts.brand, posts.price, posts.image, users.nickname, users.user_image from posts, users
        join post_tag on posts.id = post_tag.postId
        join tags on post_tag.tagId = tags.id
        where tags.name like :searchHashtag`, {
          replacements: {searchHashtag: `%${queryString}%`},
          type: QueryTypes.SELECT
        }
      )
      if(searchHashtag){
        res.status(200).send(searchHashtag)
      } else {
        res.status(400).send('error message');
      }
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
    //       // where users.nickname = ${searchWord}
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