const express = require('express');
const router = express.Router();

const authValidator = require('../util/authValidator');
const authController = require('../controllers/authController');

router.post('/signup', authValidator.signupValidator, authController.signup);
router.post('/login', authValidator.loginValidator, authController.login)

module.exports = router;
