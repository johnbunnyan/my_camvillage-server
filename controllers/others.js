const { user, post, mainslide, tag } = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다
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
      // console.log(result[0].dataValues.image)
    })
    .catch(err => {
      res.status(400).send('error')
    }) 
  },

  searchController: async (req, res) => {

    // try {
      const { category, queryString } = req.body;
      // const query =  `select posts.id, posts.title, posts.category, posts.description,
      // posts.brand, posts.price, posts.image, users.nickname, users.user_image from users, posts
      // where posts.title like :searchWord`


      if(category === 'title'){
        // const searchWord = await db.sequelize.query(query, {
        //     replacements: {searchWord: queryString},
        //     type: QueryTypes.SELECT
        //   }
        // )
        const searchWord = await post.findAll({
          attributes: ['id', 'title', 'category', 'description', 'brand', 'price', 'image', 'createdAt'],
          include: [{
            model: user,
            attributes: ['nickname', 'user_image']
          },{
            model: tag,
            attributes: ['name']
          }],
          where: {
            title: {
              [Op.like]: '%' + queryString + '%'
            }
          },
          order: [['createdAt', 'asc']]
        })
        // console.log(searchWord);
        if(searchWord){
          res.status(200).send(searchWord) // searchWord는 배열로 들어감 -> 배열 안에 요소가 객체 (posts의 정보가 있음)
        } else {
          res.status(500).send('error message');
        }
      } else if(category === 'nickname'){
        // const searchNickname = await db.sequelize.query(
        //   `select posts.id, posts.title, posts.category, posts.description,
        //   posts.brand, posts.price, posts.image, users.nickname, users.user_image from users, posts
        //   join post_user on posts.id = post_user.postId
        //   join users on post_user.userId = users.id
        //   where users.nickname like :searchNickname`, {
        //     replacements: {searchNickname: queryString},
        //     type: QueryTypes.SELECT
        //   }
        // )
        const searchNickname = await post.findAll({
          attributes: ['id', 'title', 'category', 'description', 'brand', 'price', 'image', 'createdAt'],
          include: [{
            model: tag,
            attributes: ['name']
          },{  
            model: user,
            attributes: ['nickname', 'user_image'],
            where: {
              nickname: {
                [Op.like]: queryString
              }
            }
          }],
          through: 'post_user',
          order:[['createdAt', 'asc']]
        })
        if(searchNickname){
          res.status(200).send(searchNickname)
        } else {
          res.status(500).send('error message');
        }
      } else if(category === 'hashtag'){
        // const searchHashtag = await db.sequelize.query(
        //   `select posts.id, posts.title, posts.category, posts.description,
        //   posts.brand, posts.price, posts.image, users.nickname, users.user_image from users, posts
        //   join post_tag on posts.id = post_tag.postId
        //   join tags on post_tag.tagId = tags.id
        //   where tags.name like :searchHashtag`, {
        //     replacements: {searchHashtag: queryString},
        //     type: QueryTypes.SELECT
        //   }
        // )
 
        const searchHashtag = await post.findAll({
          attributes: ['id', 'title', 'category', 'description', 'brand', 'price', 'image', 'createdAt'],
          include: [{
            model: user,
            attributes: ['nickname', 'user_image'],
          },{
            model: tag,
            attributes: ['name'],
            where: {
              name: {
                [Op.like]: queryString
              }
            }
          }],
          through: 'post_tag',
          order:[['createdAt', 'asc']]
        })

        if(searchHashtag){
          res.status(200).send(searchHashtag)
        } else {
          res.status(500).send('error message');
        }
      }

      
      //  /search?searchType=nickname&searchWord=jordan
      // const { searchType, searchWord } = req.query;
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
  
    // } catch(error){
    //   res.status(500).send('error')

    // }
  }  
};