const express = require('express');
const router = express.Router();
const multer = require('multer');

const isAuth = require('../middleware/isAuth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg'
    ) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  },
});

const feedController = require('../controllers/articleController');
const inputValidator = require('../util/postValidator');

router.get('/posts', isAuth, feedController.getPosts);
router.get('/post/:postId', isAuth, feedController.getPost);

router.post(
  '/post',
  isAuth,
  upload.single('image'),
  inputValidator.newPostValidator,
  feedController.postPost
);

router.put(
  '/post/:postId',
  isAuth,
  upload.single('image'),
  inputValidator.newPostValidator,
  feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
