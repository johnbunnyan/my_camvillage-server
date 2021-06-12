//const { user } = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다

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
    const { title, hashtag, category, brand, price, description, image } = req.body;
    const accessTokenData = isAuthorized(req);

    if(accessTokenData){
      const { user_id } = accessTokenData;
    
      const userInfo = await user.findOne({
        where : {user_id}
      })
      if(!userInfo){
        res.status(400).send("토큰이 만료되었습니다" )
      } else {
        const submitPost = await post.create({ // tags 테이블에 tag 어떻게 넣을까
          title: title,
          category: category,
          description: description,
          brand: brand,
          price: price,
          image: image // 이미지 어떻게 할지 더 고민 필요
        })
        if(submitPost){
          res.status(200).send('데이터 추가 완료')
        } else {
          res.status(400).send('데이터 추가 실패')
        }
      }  
      //req.body의 정보들을 userDB에 업데이트
      //수정된 데이터가 있을때만 업데이트, 없으면 x 
      // if(req.body.nickname){
      //   userInfo.nickname=req.body.nickname
      // }
      // if(req.body.email){
      //   userInfo.email=req.body.email
      // }
      // if(req.body.password){
      //   userInfo.password=req.body.password
      // }
      // if(req.body.photo){
      //   userInfo.photo=req.body.photo
      // }

      // await userInfo.save()

      // res.status(200).send(userInfo)
      //   }
      // }else if(!accessTokenData){
      //   res.status(401).send("토큰이 만료되었습니다")
      // }
      // else{
      //   res.status(500).send("err");
      // }
    }


    // //토큰 있는지 확인
// const accessTokenData = isAuthorized(req);
// //console.log(accessTokenData)


//     if(accessTokenData){
//       const { user_id } = accessTokenData;

//       //console.log(itemInfo[0].dataValues)//해당 유저 정보
//       //console.log(itemInfo[0].dataValues.posts)//해당 유저의 포스트
//       //기본적으로 배열 안에 리스트업->where로 인덱스[n] 구체화 시키면 해결

//       //todo
//       //🔵해당 유저가 가진 포스트 리스트업
//       //🔵그 포스트의 해쉬태그
//       //🔴그 포스트의 카테고리(머지하면 가능)


// //해당유저와 포스트 및 태그//////////////////////////////////////
// const itemInfo = await user.findAll({
//   include:{
//     model:post,
//     include:[{
//       model:tag
//     },{
//       model:category
//     }]
//   },
//   where:{user_id: user_id}
//  })

// //ps.forEach(ps => console.log(ps.toJSON()))
// //ps.forEach(ps => console.log(ps.posts[0].dataValues.tags))

// res.status(200).send({
//   data:itemInfo
// })
//     }else if(!accessTokenData){
//       res.status(401).send("토큰이 만료되었습니다")
//     }
//     else{
//       res.status(500).send("err");

//     }


//   },



  },

  requestController: (req, res) => {
    // /item/request (post)
  },
  idController: (req, res) => {
    // /item/:id (get)
  }
};