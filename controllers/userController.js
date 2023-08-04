const User = require('../models/userModel');

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error('Not Authenticated');
      err.statusCode = 401;

      return next(err);
    }

    return res.status(200).json({ status: user.status });
  } catch (error) {
    error.statusCode = 500;
    error.errorContent = error;

    return next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const err = new Error('Not Authenticated');
      err.statusCode = 401;

      return next(err);
    }

    const statusUpdate = req.body.status;
    user.status = statusUpdate;

    await user.save();

    return res.status(200).json({ status: req.body.status });
  } catch (error) {
    error.statusCode = 500;
    error.errorContent = error;

    return next(error);
  }
};
