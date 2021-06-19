const router = require('express').Router();
const controller = require('../controllers/user');

 //이미지 관련 모듈 
 const multer = require("multer");
 
 //아래 storage 보관장소에 대한 세팅(자동으로 보관폴더 만들어줌)
 var _storage = multer.diskStorage({
    
    //이미지 어디로 넣을거냐
     destination:function (req,file,cb){
                    //전역상태
         cb(null, 'uploads/')
     },
     //넣을 파일 이름을 어떻게 할거냐(file.~~)
     filename:function(req,file,cb){
         cb(null,`${Date.now()}-bezkoder-${file.originalname}`)
     }
 })

 //이미지를 필터링하는 기능(화살표도 물론 가능하다...!)
 var imageFilter=(req,file,cb)=>{
     //이미지 파일인지 아닌지 확장자로 판별
if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
    return cb(new Error("적합한 이미지 파일 형식이 아닙니다"))
}
cb(null, true)
 }

 //upload 이게 찐 미들웨어 애가 다해먹고 위에 함수는 이 미들웨어를 위한 세팅역할
const upload = multer({storage:_storage, fileFilter:imageFilter})
const fs = require('fs')

//이미지 전송할때 파일이름 영어로 해야 안깨짐
//upload.single('user_image'), =>두번째 파라미터로 넣어주면 
//req에 file이라는 객체를 만들어주고 거기에 전송된 파일을 담아줌
//single의 () 안에는 보내는 파일의 키 이름을 넣어줌(json키랑 키값처럼 똑같이, 여기 value는 이미지 파일일 뿐)
// ex) req.file: {
//     fieldname: 'user_image',
//     originalname: '\ts\x0Fs\x05u�\tc� 2021-06-14 \x0Bi\x12n 6.38.48.png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     destination: 'uploads/',
//     filename: '1c8c2ce13b95823dbb634c9359e8c73f',
//     path: 'uploads/1c8c2ce13b95823dbb634c9359e8c73f',
//     size: 596308
//   }

//


router.post('/login', controller.loginController);
router.post('/login/google', controller.googleLoginController);
router.post('/logout', controller.logoutController);
router.post('/signup', controller.signupController);

//router.get('/mypage', controller.mypageController);
//router.get('/item', controller.itemController);
router.get('/request', controller.requestController);
router.get('/requested', controller.requestedController);
router.put('/alter',   upload.single('user_image'),controller.alterController);
router.get('/refreshtoken', controller.refreshController);



module.exports = router;
