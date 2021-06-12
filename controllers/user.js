 //로그인이나 회원가입은 정상작동 포스트맨으로 확인
 //토큰 인증하는 부분에서 문제 생겨서 확인해야 됨
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
      
        const {id, user_id, name,email,nickname, user_image,createdAt, updatedAt} = userInfo
      
        const accessToken=generateAccessToken({id, user_id, name,email,nickname, user_image,createdAt, updatedAt})
        const refreshToken =generateRefreshToken({id, user_id, name,email,nickname, user_image,createdAt, updatedAt})

      //res의 _header에 Set-Cookie키 안에 refreshToken들어감
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      }).status(200).json({ accessToken:accessToken,id, user_id, name,email,nickname, user_image,createdAt, updatedAt} )
    }else{
      res.status(500).send("err");


    }
      //console.log(cookie)

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

if(!accessTokenData){
  res.status(401).send("토큰이 만료되었습니다")
}else if(accessTokenData){
  //쿠키에 담겨있는 토큰을 없애면 로그아웃 되는 거
  //req.headers["authorization"]에 들어있는 액세스 토큰
 //Set-Cookie에 들어있는 리프레쉬 토큰


  req.headers.authorization = '' //액세스 토큰 없애기
  res.clearCookie('refreshToken') //쿠키지워서 리프레쉬 토큰 없애기
 //console.log(req)
  res.status(200).send("성공적으로 로그아웃 하였습니다") 

}else{
  res.status(500).send('err')
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
  user_image:req.body.user_image,
  name:req.body.name,
  user_image:null

})
//회원가입 정보 DB에 저장하면서 토큰 만들어 주기
//console.log(saveInfo)
const {id, user_id, name,email,nickname, user_image,createdAt, updatedAt} = saveInfo
      //console.log(nickname)
      const accessToken = generateAccessToken({id, user_id, name,email,nickname, user_image,createdAt, updatedAt})
      const refreshToken = generateRefreshToken({id, user_id, name,email,nickname, user_image,createdAt, updatedAt})
      //console.log(accessToken)
     //리프레쉬토큰 헤더에 넣고 바디에 유저 데이터랑 액세스토큰 넣기



res.cookie("refreshToken", refreshToken, {
  httpOnly:true
})

.status(201).json({
  accessToken:accessToken,
  id:saveInfo.dataValues.id, 
  user_id:saveInfo.dataValues.user_id,//비밀번호 주는 것이 맞나?
  name:saveInfo.dataValues.name,
  email:saveInfo.dataValues.email,
  nickname:saveInfo.dataValues.nickname,
  user_image:saveInfo.dataValues.user_image, //디폴트 이미지 저장 및 제공방법 고민하기
  createdAt:saveInfo.dataValues.createdAt,
  updatedAt:saveInfo.dataValues.updatedAt
})

}else{
  res.status(500).send("err");
}
  },

 
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


  //내가 어떤 게시물에 신청을 한 것(상대방의 응답 표시해야 됨)
  //requestlist에서 아이디 찾고,(id)
  // 그 아이디와 연결된 post랑 confirm찾고 
  // 그 포스트의 정보 찾고
  requestController: async (req, res) => {
  //   request: [
  //     {
  //         "id": PK,
  //         "userId": my id,
  //         // 물건 올린 사람 id
  
  
  //          "title": "title",
  //         "image": "image",
  //         "confirmation": '0', // '0': no response, '1': yes, '2': no
  //         "createdAt": "createdAt",
  //         "updatedAt": "updatedAt"
  //     },
  //     ...
  // ]

const accessTokenData = isAuthorized(req);

if(accessTokenData){
  //const { user_id } = accessTokenData;
  const { id } = accessTokenData;


//해당유저와 포스트 정보 및 리퀘스트 조인테이블//////////////////////////////////////
const requestInfo = await requestlist.findAll({
include:{
model:post,
include:[{
  model:user
}],
//through:{}
},
 //where:{id: id}
})

//ps.forEach(ps => console.log(ps.toJSON()))
//ps.forEach(ps => console.log(ps.posts[0].dataValues.tags))


// {
//   id: requestInfo[0].id,
//   userId: requestInfo[0].post.users[0].user_id,
//   title: requestInfo[0].post.title,
//   image: requestInfo[0].post.image,
//   confirmation: requestInfo[0].confirmation, // '0': no response, '1': yes, '2': no
//   createdAt: requestInfo[0].createdAt,
//   updatedAt: requestInfo[0].updatedAt
// }
//공통된 것은 id밖에 없다
//requestInfo 는 배열이니까 하나씩 뽑아내서 아래 형식으로 보내주면 됨



const pacakage=requestInfo.map((el)=>{
return {
          id: el.id,
          userId: el.post.users[0].user_id,
          title: el.post.title,
          image: el.post.image,
          confirmation: el.confirmation, // '0': no response, '1': yes, '2': no
          createdAt: el.createdAt,
          updatedAt: el.updatedAt
      }
    }
)
console.log(pacakage)



res.status(200).send({
  request:requestInfo
})
}else if(!accessTokenData){
  res.status(401).send("토큰이 만료되었습니다")
}
else{
  res.status(500).send("err");
}


  },



//👉나의 게시물을 다른 유저가 신청했을 때
//post_user에서 내 아이디로 내 게시물id찾고 
//그 게시물id를 requestlists로 가져가서 해당되는 로우 있는지 확인하고 그 게시물 정보 가져오고
//있으면 그 로우의 userId(신청한사람)유저아이디 가져오기
  requestedController: async (req, res) => {


  const accessTokenData = isAuthorized(req);

  if(accessTokenData){
    const { user_id } = accessTokenData;

    //유저아이디로 먼저 해당하는 포스트 찾고 그 row의 포스트 정보 및 리퀘스트 조인테이블//////////////////////////////////////
  const requestedInfo = await user.findAll(
    {
    include:{
    model:post,
    include:[{
      model:requestlist, 
      //attributes:['confirmation']
      //where: {confirmation:'1'}
    }],
     //through:'post_user'
    },
    where:{user_id: user_id}
    }
    )
  
    //ps.forEach(ps => console.log(ps.toJSON()))
    //ps.forEach(ps => console.log(ps.posts[0].dataValues.tags))
  
//나는 여러 포스트를 가지고 있고 그 포스트마다 여러 사람이 신청했을 수 있다

//1. 조건 
//requestedInfo[0].posts.dataValues.requestlists의 내용이 있는 것만


//2. 여러 포스트 배열          
//requestedInfo[0].posts 
  //그럼 포스트 기준으로 다 뽑아서 배열 만들어 놓고, 그 배열을 또 map
//3. 여러 신청한 사람 배열(기준)
//requestedInfo[0].posts.dataValues.requestlists


const pacakage=requestedInfo[0].posts.map((el)=>{
      return {
                id: requestedInfo[0].id,

                 //나중에 id를 userId로 바꿔야됨
                userId: el.dataValues.requestlists, 
                title: el.title,
                image: el.image,
                confirmation: el.dataValues.requestlists, 
                createdAt: el.dataValues.requestlists,
                updatedAt: el.dataValues.requestlists
            }
          }
      )
      
const last = pacakage.map((el)=>{
  return{
                id: el.id,

                 //나중에 id를 userId로 바꿔야됨
                userId: el, 
                title: el.title,
                image: el.image,
                confirmation: el.requestlists, 
                createdAt: el.requestlists,
                updatedAt: el.requestlists
  }
})

      console.log(last)




  
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
 

userInfo.nickname=req.body.nickname
  userInfo.email=req.body.email
  userInfo.password=req.body.password
  userInfo.user_image=req.body.user_image

await userInfo.save()


res.status(200).send({
  id:userInfo.dataValues.id, 
  user_id:userInfo.dataValues.user_id,//비밀번호 주는 것이 맞나?
  name:userInfo.dataValues.name,
  email:userInfo.dataValues.email,
  nickname:userInfo.dataValues.nickname,
  user_image:userInfo.dataValues.user_image, //디폴트 이미지 저장 및 제공방법 고민하기
  createdAt:userInfo.dataValues.createdAt,
  updatedAt:userInfo.dataValues.updatedAt
})
  }
}else if(!accessTokenData){
  res.status(401).send("토큰이 만료되었습니다")
}
else{
  res.status(500).send("err");
}



  },





  //////////////////리프레쉬 컨트롤러//////////////////////////
  refreshController: async (req, res) => {


        //토큰 있는지 확인
    const accessTokenData = isAuthorized(req);
    
    
    if(accessTokenData){
      const { user_id } = accessTokenData;
     
      const userInfo = await user.findOne({
        where : {user_id}
      })
      if(!userInfo){
        res.status(400).send("유저정보가 없습니다" )
      }else{
   
    res.status(200).send(userInfo)
      }



    }else if(!accessTokenData){
      const refreshToken = req.headers.cookie.slice(13)
      //console.log(req.headers.cookie.slice(13))

      if (!refreshToken) {
        return res.json({ data: null, message: '리프레쉬 토큰이 만료되었습니다' });
      }else{

        const refreshTokenData = checkRefeshToken(refreshToken);
        if (!refreshTokenData) {
          return res.json({
            message: '유효하지 않는 리프레쉬 토큰입니다. 다시 로그인 해주세요.',
          });
        }
      
        const { user_id } = refreshTokenData;
        user.findOne({ where: { user_id:user_id } })
          .then((data) => {
            if (!data) {
              return res.json({
                data: null,
                message: 'refresh token has been tempered',
              });
            }
            //delete data.dataValues.password;
      //console.log(data.dataValues)
            const newAccessToken = generateAccessToken(data.dataValues);
            resendAccessToken(res, newAccessToken);
          })
          .catch((err) => {
            console.log(err);
          });




      }

     
    }
    else{
      res.status(500).send("err");
    }
    
    
    
      }
};
