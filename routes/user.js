const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/login', controller.loginController);
router.get('/logout', controller.logoutController);
router.post('/signup', controller.signupController);
router.get('/mypage', controller.mypageController);
router.get('/item', controller.itemController);
router.get('/request', controller.requestController);
router.get('/requested', controller.requestedController);
router.put('/alter', controller.alterController);

module.exports = router;
