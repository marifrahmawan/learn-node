const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Valdation Error');
      error.statusCode = 422;
      error.errorContent = errors.array();

      return next(error);
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email: email,
      name: name,
      password: hashPassword,
    });
    await newUser.save();

    return res.status(200).json({
      msg: 'Signup Success',
    });
  } catch (error) {
    const err = new Error('Something went wrong');
    err.statisCode = 500;
    err.errorContent = error;

    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const email = req.body.email;
    const password = req.body.password;

    if (!errors.isEmpty()) {
      const error = new Error('Validation Error');
      error.statusCode = 422;
      error.errorContent = errors.array();

      return next(error);
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error(`Can't Find User with That Email`);
      error.statusCode = 422;

      return next(error);
    }

    const cmprPassword = await bcrypt.compare(password, user.password);

    if (!cmprPassword) {
      const error = new Error('Wrong Password');
      error.statusCode = 422;
      return next(error);
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.SECRET_KEY,
      {expiresIn: '7d'}
    );

    return res.status(200).json({ msg: 'Logged In', token: token, userId: user._id.toString() });
  } catch (error) {
    const err = new Error('Something went wrong');
    err.statisCode = 500;
    err.errorContent = error;

    return next(err);
  }
};
