const { Schema, default: mongoose } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'I am New',
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Article',
    },
  ],
  resetToken: String,
  resetTokenExp: Date,
});

module.exports = User = mongoose.model('user', userSchema);
