
 require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

 const { user,post ,category,tag,index,requestlist} = require("../models"); // 생성한 테이블에서 필요한 모델을 가져온다

 const {isAuthorized,//토큰 있는지 없는지 확인
  generateAccessToken,
  generateRefreshToken,
  resendAccessToken,
  checkRefeshToken
  
} =require('./tokenMethod')

module.exports = {
  
  
  loginController: async (req, res) => {
    //console.log(req.body)
//post
    //req:user_id/password
//res  
// 200 {
//   "id": PK,
//   "user_id": "user_id",
//   "email": "email",
//   "password": "password",
//   "nickname": "nickname",
//   "image": "image",
//   "createdAt": "created time",
//   "updatedAt": "updated time"
// }

//401 { "유저 정보가 정확하지 않거나 비밀번호가 틀렸습니다" }
//500 err


    const userInfo = await user.findOne({
      where : {user_id: req.body.user_id, password: req.body.password}
    })
    

    //console.log(userInfo)

      if(!userInfo){
        res.status(401).send("유저 정보가 정확하지 않거나 비밀번호가 틀렸습니다")
      }else if(userInfo){
      //유저가 있으면(맞으면) 토큰도 같이 줘야됨
      //비밀번호는 안주는 게 낫지 않나?
      
        const {id, user_id, email,nickname, image,createdAt, updatedAt} = userInfo
      
        //토큰 만드는 건 함수가져와서 쓰면 되지만 
        const accessToken=generateAccessToken({id, user_id, email,nickname, image,createdAt, updatedAt})
        const refreshToken =generateRefreshToken({id, user_id, email,nickname, image,createdAt, updatedAt})

        // const accessToken = sign({id, user_id, email,nickname, image,createdAt, updatedAt}
        //   ,process.env.ACCESS_SECRET, { expiresIn: "1d" })
        
        // const refreshToken = sign({id, user_id, email,nickname, image,createdAt, updatedAt},
        //   process.env.REFRESH_SECRET,{ expiresIn: "7d" })
        
        //보낼때는 다른 응답(상태,json)도 같이 보내야 되기 때문에 해당 파일에서 처리
 
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
        }).status(200).json({accessToken:accessToken, data:{id, user_id, email,nickname, image,createdAt, updatedAt}} )
      }else{
        res.status(500).send("err");
      
      }


},



logoutController: (req, res) => {


//post?
  //req:jwt(localstorage),,express-session(req.session.userid)
//res
// 200 { "성공적으로 로그아웃 하였습니" }
// 400 { "로그인을 해 주세" }
// 500 err


 // localStorage 토큰 저장 시 클라이언트에서 localStorage에서 removeItem으로 삭제하면 됨
//토큰은 세션이 아니라 클라이언트의 로컬 스토리지에 저장되어 있음
//로컬에서 파괴해도 되는지 안되는지 응답 분기만 
const accessTokenData = isAuthorized(req)
//console.log(accessTokenData)
//console.log(req)
if(!accessTokenData){
  res.status(400).send("로그인을 해 주세요")
}else{
  //쿠키에 담겨있는 토큰을 없애면 로그아웃 되는 거
  //req.headers["authorization"]에 들어있는 액세스 토큰
 //Set-Cookie에 들어있는 리프레쉬 토큰

 req.headers.authorization = '' //액세스 토큰 없애기
 res.clearCookie('refreshToken') //쿠키지워서 리프레쉬 토큰 없애기
 //console.log(req)
  res.status(200).send("성공적으로 로그아웃 하였습니다") 
  
}

  
},




signupController: async (req, res) => {
  //post
    //req:nickname,password,name,user_id,email(body)
//res
// 201 {
//   "id": PK,
//   "user_id": "user_id",
//   "email": "email",
//   "password": "password",
//   "nickname": "nickname",
//   "image": "default image",
//   "createdAt": "created time",
//   "updatedAt": "updated time"
// }
//409 { "이미 존재하는 아이디입니다" }
//500 err


//불충분한 정보 전달했을때 응답을 넣을지 말지
// if(req.body.username===undefined||
//   req.body.email===undefined||
//   req.body.password===undefined||
//   req.body.mobile===undefined
//   ){
  
//   res.status(422).send("insufficient parameters supplied")

// }

const userInfo = await user.findOne({
  where : {user_id: req.body.user_id}
})


if(userInfo){
  res.status(409).send("이미 존재하는 아이디입니다") 
}

else if(!userInfo){
 const saveInfo = await user.create({
  user_id:req.body.user_id,
  email: req.body.email, 
  password: req.body.password,
  nickname:req.body.nickname,
  image:null,
  name:req.body.name

})
//회원가입 정보 DB에 저장하면서 토큰 만들어 주기
//console.log(saveInfo)
      const {id, user_id, email,nickname, name,image,createdAt, updatedAt} = saveInfo
      //console.log(nickname)
      const accessToken = generateAccessToken({id, user_id, email,nickname, name,image,createdAt, updatedAt})
      const refreshToken = generateRefreshToken({id, user_id, email,nickname, name,image,createdAt, updatedAt})
      //console.log(accessToken)
     //리프레쉬토큰 헤더에 넣고 바디에 유저 데이터랑 액세스토큰 넣기
    
    
     res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    })
.status(201).json({
  accessToken:accessToken,
  id:saveInfo.dataValues.id, 
  user_id:saveInfo.dataValues.user_id,//비밀번호 주는 것이 맞나?
  email:saveInfo.dataValues.email,
  nickname:saveInfo.dataValues.nickname,
  image:saveInfo.dataValues.default_image, //디폴트 이미지 저장 및 제공방법 고민하기
  createdAt:saveInfo.dataValues.createdAt,
  updatedAt:saveInfo.dataValues.updatedAt
})

}else{
  res.status(500).send("err");
}
  },






  mypageController: async (req, res) => {
  //get
    //req token
//res
// 200 {
//   "id": PK,
//   "user_id": "user_id",
//   "email": "email",
//   "password": "password",
//   "nickname": "nickname",
//   "image": "default image",
//   "createdAt": "created time",
//   "updatedAt": "updated time"
// }
//400 { "토큰이 만료되었습니" }
//500 err

//토큰 있는지 확인
const accessTokenData = isAuthorized(req);


    if(accessTokenData){
      const { user_id } = accessTokenData;
     
      const giveInfo = await user.findOne({
        where : {user_id}
      })

      if(!giveInfo){
        return res.status(400).send("토큰이 만료되었습니다")
      }else{
        res.status(200).json({
          id:giveInfo.dataValues.id, 
          user_id:giveInfo.dataValues.user_id,//비밀번호 주는 것이 맞나?
          email:giveInfo.dataValues.email,
          nickname:giveInfo.dataValues.nickname,
          image:giveInfo.dataValues.default_image, //디폴트 이미지 저장 및 제공방법 고민하기
          createdAt:giveInfo.dataValues.createdAt,
          updatedAt:giveInfo.dataValues.updatedAt,
        })  
      }

    }else if(!accessTokenData){
      
      res.status(401).send("토큰이 만료되었습니다")

    }else{
    res.status(500).send("err");
    }
  },



  itemController: async (req, res) => {
    
   
  //get
    //req token
  //
//   200 {
//     items: [{
//             "id": PK,
//             "user_id": "user_id",
//             "title": "title",
//             "hashtag": "hashtag",
//             "photo": "photo",
//             "category_id": "category_id",
//             "brand": "brand",
//             "price": "price",
//             "info": "info,
//             "createdAt": "createdAt",
//             "updatedAt": "updatedAt"
//         },
//         ...
//         ]
// }
//500 err

//토큰 있는지 확인
const accessTokenData = isAuthorized(req);

//console.log(accessTokenData)

    if(accessTokenData){
      const { user_id } = accessTokenData;
     
  
      //console.log(itemInfo[0].dataValues)//해당 유저 정보
      //console.log(itemInfo[0].dataValues.posts)//해당 유저의 포스트
      //기본적으로 배열 안에 리스트업->where로 인덱스[n] 구체화 시키면 해결
      
      //todo
      //🔵해당 유저가 가진 포스트 리스트업
      //🔵그 포스트의 해쉬태그
      //🔴그 포스트의 카테고리(머지하면 가능)


//해당유저와 포스트 및 태그//////////////////////////////////////
const itemInfo = await user.findAll({
 include:{
   model:post,
   include:[{
     model:tag
   },{
     model:category
   }]
 },
 where:{user_id: user_id}
})

//ps.forEach(ps => console.log(ps.toJSON()))
//ps.forEach(ps => console.log(ps.posts[0].dataValues.tags))


res.status(200).send({
  data:itemInfo
})
    }else if(!accessTokenData){
      res.status(401).send("토큰이 만료되었습니다")
    }
    else{
      res.status(500).send("err");
    }
  },

  
  requestController: async (req, res) => {
  //post
    //req token
//
// 200 {
//   request: [
//       {
//           "id": PK,
//           "user_id": "user_id",
//           "title": "title",
//           "photo": "photo",
//           "confirmation": 0, // 0: no response, 1: yes, 2: no
//           "createdAt": "createdAt",
//           "updatedAt": "updatedAt"
//       },
//       ...
//   ]
// }
//500 err

//여기 메서드에서 줄 데이터 그룹-3개
//postId(나)의 게시물 정보와 나의 userId/그리고 userId(신청유저) / 컨퍼메이션

const accessTokenData = isAuthorized(req);

if(accessTokenData){
  const { user_id } = accessTokenData;
 

//해당유저와 포스트 정보 및 리퀘스트 조인테이블//////////////////////////////////////
const requestInfo = await requestlist.findAll({
// include:{
// model:post,
// through:{}
// },
// where:{user_id: user_id}
})

//ps.forEach(ps => console.log(ps.toJSON()))
//ps.forEach(ps => console.log(ps.posts[0].dataValues.tags))


res.status(200).send({
data:requestInfo
})
}else if(!accessTokenData){
  res.status(401).send("토큰이 만료되었습니다")
}
else{
  res.status(500).send("err");
}


  },

  requestedController: async (req, res) => {

    //get
      //req token
    //res
  //   200 {
  //     requested: [
  //         {
  //             "id": PK,
  //             "user_id": "user_id",
  //             "title": "title",
  //             "photo": "photo",
  //             "confirmation": 0, // 0: no response, 1: yes, 2: no
  //             "createdAt": "createdAt",
  //             "updatedAt": "updatedAt"
  //         },
  //         ...
  //     ]
  // }
  //500 err
  
  const accessTokenData = isAuthorized(req);

  if(accessTokenData){
    const { user_id } = accessTokenData;
   
  
  //유저아이디로 먼저 해당하는 포스트 찾고 그 row의 포스트 정보 및 리퀘스트 조인테이블//////////////////////////////////////
  const requestedInfo = await user.findAll({
  include:{
  model:post,
   through:{}
  },
  where:{user_id: user_id}
  })
  
  //ps.forEach(ps => console.log(ps.toJSON()))
  //ps.forEach(ps => console.log(ps.posts[0].dataValues.tags))
  
  
  res.status(200).send({
  data:requestedInfo
  })
}else if(!accessTokenData){
  res.status(401).send("토큰이 만료되었습니다")
}
else{
  res.status(500).send("err");
}
  

    },

  alterController: async (req, res) => {
//계속해서 토큰을 확인하는 이유:매 요청은 서로 독립적,유저를 식별해야 해당하는 정보 처리가능  

  //req token(headers) / nickname,email,password,photo(body)
  //res
//   200 {
//     "id": PK,
//     "user_id": "user_id",
//     "email": "email",
//     "password": "password",
//     "nickname": "nickname",
//     "image": "image",
//     "createdAt": "created time",
//     "updatedAt": "updated time"
// }
//401 { "토큰이 만료되었습니" }
//500 err


    //토큰 있는지 확인
const accessTokenData = isAuthorized(req);


if(accessTokenData){
  const { user_id } = accessTokenData;
 
  const userInfo = await user.findOne({
    where : {user_id}
  })
  if(!userInfo){
    res.status(400).send("토큰이 만료되었습니다" )
  }else{
//req.body의 정보들을 userDB에 업데이트
//수정된 데이터가 있을때만 업데이트, 없으면 x 
if(req.body.nickname){
  userInfo.nickname=req.body.nickname
}
if(req.body.email){
  userInfo.email=req.body.email
}
if(req.body.password){
  userInfo.password=req.body.password
}
if(req.body.photo){
  userInfo.photo=req.body.photo
}

await userInfo.save()

res.status(200).send(userInfo)
  }
}else if(!accessTokenData){
  res.status(401).send("토큰이 만료되었습니다")
}
else{
  res.status(500).send("err");
}



  },
};
