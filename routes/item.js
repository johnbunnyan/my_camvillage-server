const express = require('express');
const router = express.Router();
const controller = require('../controllers/item');

//const multer = require('multer')
//const storage = multer.diskStorage({
//  destination: function (req, file, cb){
//     cb(null, itemUploads/) // 이거는 디렉토리를 서버에 생성해야 함
// },
// filename: function (req, file, cb) {
//     cb(null, file.originalName)
// }
//})
//const upload = multer({ storage: storage })

router.post('/upload', controller.uploadController);
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
  