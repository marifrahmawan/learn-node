const { Schema, default: mongoose } = require('mongoose');

const articleSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    author: {
      userId: {
        type: Schema.Types.ObjectId,
      },
    },
    articleText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Article = mongoose.model('article', articleSchema);
