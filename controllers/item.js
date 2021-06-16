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
  
} =require('./tokenMethod');
const { request } = require('express');

module.exports = {
  
  uploadController: async (req, res) => {
    // /item/upload (post)
     const { user_id, title, category, description, brand, price, image, hashtag } = req.body;
    // const accessTokenData = isAuthorized(req);
    console.log(req.body.user_id)
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
        const findUser = await user.findOne({
          where: {
            user_id: user_id

          }  
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
            replacements: [submitPost.dataValues.id, findUser.dataValues.id],
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


        if(submitPost && findUser && submitTag && submitPostUser && submitPostTag){
          const allPosts = await user.findOne({
            attributes: ['nickname', 'user_image'],
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
          // const allPosts = await post.findOne({
          //   include: [{
          //     model: user,
          //     attributes: ['nickname', 'user_image'],
          //     through: 'post_user',
          //     where: {
          //       user_id: submitUser.dataValues.user_id
          //     }
          //   },{
          //     model: tag,
          //     attributes: ['name'],
          //   }],
          //   where: {
          //     id : submitPost.dataValues.id
          //   }
          // });

          if(allPosts){
            res.status(200).send(allPosts)
          } else {
            res.status(500).send('err')
          }
        }
  },
  // imageController: async (req, res) => {
  //  const image = req.file
  //  res.status(200).send(image)  
  // },

  requestController: async (req, res) => {
    // /item/request (post)
    
    const { post_id, user_id } = req.body; 
    const requested = await db.sequelize.query(
      `Insert into requestlists (postId, userId, confirmation, createdAt) values(?,?,?,?)`, {
        replacements: [post_id, user_id, '0', new Date()],
        type: QueryTypes.INSERT
      }
    )
    const itemrequest =  await requestlist.findOne({
      where: {postId:post_id, userId:user_id},
      attributes: ['id', 'confirmation','postId', 'userId'],
      // include: [{
      //   model: post,
      //   attributes: ['id']
      // }]
    })


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
      res.status(200).send(itemrequest)
    }
  },
 
  confirmationController: async (req, res) => {

    //이 컨트롤러는 해당 포스트의 주인이 0,1,2 중 하나를 눌렀을때 실행
    //각 컨퍼메이션을 db에 업데이트만 해주면 끝
    const accessTokenData = isAuthorized(req);
    console.log(accessTokenData)
        if(accessTokenData){

        const { confirmation, id, userId } = req.body; 

        const confirm = await requestlist.findOne({
          where: {postId:post_id, userId:user_id},
          // include: [{
          //   model: post,
          //   attributes: ['id']
          // }]
        })

    if(!confirm){
      res.status(402).send("신청되지 않은 품목입니다")
    }else{
      confirm.confirmation = confirmation
      await confirm.save();
      await requestlist.destroy({
        where: {
          [Op.and]: {
            post: id,
            userId: {
              [Op.ne]: userId,
            },
            confirmation: {
              [Op.ne]: "1"
            }  
          }
        }
      })
        res.status(200).send
      }
      res.status(200).send("응답을 보냈습니다")
    }
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
            nickname: selectedPost.dataValues.users[0].nickname,
            user_image: selectedPost.dataValues.users[0].user_image,
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