const { validationResult } = require('express-validator');
const Article = require('../models/articleModel');
const User = require('../models/userModel');
const clearImage = require('../util/clearImage');

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 3;

    let totalItems = await Article.find().countDocuments();

    const posts = await Article.find()
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    console.log(posts);
    if (posts) {
      console.log(posts);
      res.status(200).json({ posts: posts, totalItems: totalItems });
    }
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Article.findById(postId).populate('creator');

    if (!post) {
      const err = new Error(`Can't Find the Product`);
      err.statusCode = 404;

      return next(err);
    }

    return res.status(200).json({
      post: post,
    });
  } catch (error) {
    error.statusCode = 500;

    next(error);
  }
};

exports.postPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error('Validation failed');
      err.statusCode = 422;
      err.errorContent = errors.array();

      return next(err);
    }

    const title = req.body.title;
    const content = req.body.content;

    if (!req.file) {
      console.log('No Image Provided');
    }

    const imageUrl = req.file.path.replace('\\', '/');

    const post = new Article({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });

    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    return res.status(201).json({
      msg: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    const err = new Error('Something went wrong');
    err.statusCode = 500;
    err.content = error;

    return next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error('Validation failed');
      err.statusCode = 422;
      err.errorContent = errors.array();

      return next(err);
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = await Article.findById(postId);

    if (!post) {
      const err = new Error(`Can't Find the Product`);
      err.statusCode = 404;

      return next(err);
    }

    let imageUrl;

    if (req.file) {
      imageUrl = req.file.path.replace('\\', '/');
    } else {
      imageUrl = post.imageUrl;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage.clearImage(post.imageUrl);
    }

    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;

    if (post.creator.toString() !== req.userId.toString()) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;

      return next(err);
    }

    await post.save();

    return res.status(200).json({ msg: 'Post Updated', post: post });
  } catch (error) {
    const err = new Error('Something went wrong');
    err.statusCode = 500;
    err.content = error;

    return next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Article.findOne({ _id: postId });
    const user = await User.findById(req.userId);

    if (!post) {
      const err = new Error(`Can't Find the Product`);
      err.statusCode = 404;

      return next(err);
    }

    if (post.creator.toString() !== req.userId.toString()) {
      const err = new Error('Unauthorized');
      err.statusCode = 403;

      return next(err);
    }

    clearImage.clearImage(post.imageUrl);
    user.posts.pull(postId);

    await post.deleteOne();
    await user.save();

    return res.status(200).json({ msg: 'Deleted Post', post: post });
  } catch (error) {
    const err = new Error('Something went wrong');
    err.statusCode = 500;
    err.content = error;

    return next(err);
  }
};
