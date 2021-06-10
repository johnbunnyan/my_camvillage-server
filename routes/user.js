const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/login', controller.loginController);
router.post('/logout', controller.logoutController);
router.post('/signup', controller.signupController);
router.get('/mypage', controller.mypageController);
router.get('/item', controller.itemController);
router.post('/request', controller.requestController);
router.get('/requested', controller.requestedController);
router.put('/alter', controller.alterController);

module.exports = router;
