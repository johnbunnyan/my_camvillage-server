const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/login', controller.loginController);
router.post('/logout', controller.logoutController);
router.post('/signup', controller.signupController);

router.get('/request', controller.requestController);
 router.get('/requested', controller.requestedController);
router.put('/alter', controller.alterController);
router.get('/refreshToken', controller.refreshController);

module.exports = router;
