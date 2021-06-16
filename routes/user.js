const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/login', controller.loginController);
router.post('/login/google', controller.googleLoginController);
router.post('/logout', controller.logoutController);
router.post('/signup', controller.signupController);
//router.get('/mypage', controller.mypageController);
//router.get('/item', controller.itemController);
router.get('/request', controller.requestController);
router.get('/requested', controller.requestedController);
router.put('/alter', controller.alterController);
router.get('/refreshtoken', controller.refreshController);


module.exports = router;
