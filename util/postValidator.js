const { body } = require('express-validator');

exports.newPostValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Enter the Title')
    .isLength({ min: 5 }).withMessage('Title Length Min 5 Character'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Enter the Article Content')
    .isLength({ min: 5 }).withMessage('Content Length Min 5 Character'),
];
