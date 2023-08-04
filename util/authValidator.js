const { body } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');

exports.signupValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Input your Email')
    .isEmail()
    .withMessage('Invalid Email')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });

      if (user) {
        throw new Error('Email already use');
      }
    }),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Input your Name')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Only Letters'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Input your Password')
    .isLength({ min: 7 }),
];

exports.loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Input youre Email')
    .isEmail()
    .withMessage('Invalid Email'),
    // .custom(async (value) => {
    //   const user = await User.findOne({ email: value });
    //   if (!user) {
    //     throw new Error(`Can't find User with that Email`);
    //   }
    // }),
  body('password').trim().notEmpty().withMessage('Input your Password'),
];
