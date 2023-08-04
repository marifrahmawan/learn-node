const { Schema, default: mongoose } = require('mongoose');

const articleSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Article', articleSchema);
