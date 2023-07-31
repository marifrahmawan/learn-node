const Article = require('../models/articleModel');

exports.getPosts = async (req, res, next) => {
  res.status(200).json({
    posts: [{ title: 'This is title', content: 'This my first Article' }],
  });
};

exports.postPosts = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    msg: 'Post created successfully!',
    post: {
      id: Math.random(),
      title: title,
      content: content,
    },
  });
};
