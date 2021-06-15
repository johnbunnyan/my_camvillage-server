//const { user } = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다
const sequelize = require('sequelize');
const Op = sequelize.Op
const { QueryTypes } = require('sequelize');
const db = require('../models/index');

require("dotenv").config();
 const { sign, verify } = require("jsonwebtoken");
 const { user,post, category, tag, index, requestlist } = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다

 const {isAuthorized,//토큰 있는지 없는지 확인
  generateAccessToken,
  generateRefreshToken,
  resendAccessToken,
  checkRefeshToken
  
} =require('./tokenMethod')

module.exports = {
  
  uploadController: async (req, res) => {
    // /item/upload (post)
    console.log(req.body);
     const { user_id, title, category, description, brand, price, image, hashtag } = req.body;
    // const accessTokenData = isAuthorized(req);

    // if(accessTokenData){
    //   const { user_id } = accessTokenData;
    
    //   const userInfo = await user.findOne({
    //     where : {user_id}
    //   })
    //   if(!userInfo){
    //     res.status(400).send("토큰이 만료되었습니다" )
    //   } else {
        // const submitPost = await db.sequelize.query(
        //   'insert into posts(title, category, description, brand, price, image) values(?,?,?,?,?,?)', {
        //     replacements: [title, category, description, brand, price, image ],
        //     type: QueryTypes.INSERT
        //   }
        // )
        // const submitUser = await db.sequelize.query(
        //   'insert into users(user_id) values(?)', {
        //     replacements: [user_id],
        //     type: QueryTypes.INSERT
        //   }
        // )
        // const submitTag = await db.sequelize.query(
        //   'insert into tags(name) values(?)', {
        //     replacements: [hashtag],
        //     type: QueryTypes.INSERT
        //   }
        // )

        const submitPost = await post.create({
          title: title,
          category: category,
          description: description,
          brand: brand,
          price: price,
          image: image,
          createdAt: new Date()
        })
        const submitUser = await user.create({
          user_id: user_id
        })  
        const submitTag = await tag.create({
          name: hashtag
        })
        const submitPostTag = await db.sequelize.query(
          `Insert into post_tag (postId, tagId) values(?,?)`, {
            replacements: [submitPost.dataValues.id, submitTag.dataValues.id],
            type: QueryTypes.INSERT
          }
        )
        const submitPostUser = await db.sequelize.query(
          `Insert into post_user (postId, userId) values(?,?)`, {
            replacements: [submitPost.dataValues.id, submitUser.dataValues.id],
            type: QueryTypes.INSERT
          }
        )
        
        //posts, users, tags 각각의 테이블에 데이터가 추가되지만 조인 관계가 설립 안 됨 (조인테이블 데이터 X)
        // const getPostId = submitPost.dataValues.id;
        // const getUserId = submitUser.dataValues.id;
        // const getTagId = submitTag.dataValues.id;

        // const submitPostUser = await post_user.create({
        //   postId: getPostId,
        //   userId: getUserId
        // })
        // const submitPostTag = await post_tag.create({
        //   postId: getPostId,
        //   tagId: getTagId
        // })

        if(submitPost && submitUser && submitTag && submitPostUser && submitPostTag){
          const allPosts = await user.findOne({
            include: {
              model: post,
              include: [
                {
                  model: tag,
                  through: {} 
                }
              ],
              where: {
                id : submitPost.dataValues.id
              }
            },
          });

          if(allPosts){
            res.status(200).send(allPosts)
          } else {
            res.status(500).send('err')
          }
    
          // const data = await db.sequelize.query(
          //   `select posts.id, posts.title, posts.category, posts.description,
          //   posts.brand, posts.price, posts.image, users.nickname, users.user_image from posts, users
          //   where posts.title like :searchWord`, {
          //     type: QueryTypes.SELECT
          //   }
          // )
        }  
      //}  
    //}
  },

  requestController: async (req, res) => {
    // /item/request (post)
    
    const { post_id, user_id } = req.body; 
    const requested = await db.sequelize.query(
      `Insert into requestlists (postId, userId, confirmation, createdAt) values(?,?,?,?)`, {
        replacements: [post_id, user_id, '0', new Date()],
        type: QueryTypes.INSERT
      }
    )
    // const requested = await requestlist.create({
    //   postId: post_id,  // 클릭한 post의 id  (숫자)
    //   userId: user_id, // 신청한 사람의 아이디명 (string)
    //   createdAt: new Date(),
    //   confirmation: "0"  // 디폴트 값으로 승낙도 거절도 아니고 신청했다는 의미
    // })

    // const requestAnswer = await requestlist.findAll({
    //   attributes: ['id', 'userId', 'postId', 'createdAt', 'confirmation'],
    //   where: {
    //     confirmation: '0'
    //   }
    // })

    if(!requested){
      res.status(500).send("err")
    } else {
      console.log(requested)
      res.status(200).send(requested)
    }
  },
  confirmationController: async (req, res) => {

  },

  idController: async (req, res) => {
    // /item/:id (get)
    // if(accessTokenData){
    //   const { user_id } = accessTokenData;
    
    //   const userInfo = await user.findOne({
    //     where : {user_id}
    //   })
    //   if(!userInfo){
    //     res.status(400).send("토큰이 만료되었습니다" )
    //   } else {
        const selectedPost = await post.findByPk(req.params.id, {
          include: [{
            model: user,
            attributes: ['nickname', 'user_image']
          },{
            model: tag,
            attributes: ['name']
          }]
        })
        if(!selectedPost){
          res.status(404).send("게시물을 찾을 수 없습니다")
        } else {
          console.log(selectedPost)
          res.status(200).send({
            id: selectedPost.dataValues.id,
            nickname: selectedPost.dataValues.users.nickname,
            user_image: selectedPost.dataValues.users.user_image,
            title: selectedPost.dataValues.title,
            category: selectedPost.dataValues.category,
            description: selectedPost.dataValues.description,
            brand: selectedPost.dataValues.brand,
            price: selectedPost.dataValues.price,
            hashtag: selectedPost.dataValues.tags,
            image: selectedPost.dataValues.image,
            createdAt: selectedPost.dataValues.createdAt,
            updatedAt: selectedPost.dataValues.updatedAt
          })
        }
      // }
    // }  
  }

};