const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const isAuth = require('../middleware/isAuth');

router.get('/status', isAuth, userController.getStatus);
router.put('/status', isAuth, userController.updateStatus);

module.exports = router;
