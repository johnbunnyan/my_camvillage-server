const express = require('express');
const router = express.Router();
const controller = require('../controllers/item');


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

//이미지를 필터링하는 기능
var imageFilter=(req,file,cb)=>{
    //이미지 파일인지 아닌지 확장자로 판별
if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
   return cb(new Error("적합한 이미지 파일 형식이 아닙니다"))
}
cb(null, true)
}

const limits = {
    fileSize : 100000
}

//upload 이게 찐 미들웨어 애가 다해먹고 위에 함수는 이 미들웨어를 위한 세팅역할
const upload = multer({storage:_storage, fileFilter:imageFilter
})



router.post('/upload', upload.single('image'),controller.uploadController);
router.post('/request', controller.requestController);
router.put('/confirmation', controller.confirmationController);
router.get('/:id', controller.idController);

router.put('/confirmation', controller.confirmationController)
//router.post('/image', upload.single('image'), controller.imageUploadConroller) 
  // image는 클라이언트 <input type="file" name="image"> name속성이 single의 인자로 들어감
  // <form action="upload" method="post" enctype="multipart/form-data">
  //    <input type="file" name="image">
  //    <input type="submit">
  // </form>   



module.exports = router;
  