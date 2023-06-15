const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const POST_PATH = path.join("/uploads/posts/post-images");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postimage: {
      type: String,
    },
    // array of ids of all comments of the post
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", POST_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

// static methods
postSchema.statics.uploadedImage = multer({ storage: storage }).single(
  "postimage"
);
postSchema.statics.postimagePath = POST_PATH;

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
