const express = require('express');
const router = express.Router();
const controller = require('../controllers/item');

router.post('/upload', controller.uploadController);
router.post('/request', controller.requestController);
router.get('/:id', controller.idController);

module.exports = router;
