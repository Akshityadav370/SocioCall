const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");
const fs = require("fs");
const path = require("path");

module.exports.create = async function (req, res) {
  
    try {
      let user = await User.findById(req.user._id);
      let post = await Post.create({
        content: req.body.content,
        user: req.user._id,
      });

      if (post) {
        user.posts.push(post);
        user.save();

        //now the ajax requesr is a xmlhttprequest or an xhr request , so we need to detect if the req is ajax or not
        if (req.xhr) {
          // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
          post = await post.populate("user", "name").execPopulate();

          return res.status(200).json({
            data: {
              post: post,
              userName: req.user.name,
            },
            message: "Post created!",
          });
        }

        req.flash("success", "Post published!");
        return res.redirect("back");
      }
    } catch (err) {
      req.flash("error", err);
      console.log("error in creating a post", err);
      return res.redirect("back");
    }
  
};

module.exports.update = async function (req, res) {
  let uid = req.query.uid;
  let pid = req.query.pid;
  if (req.user.id == uid) {
    try {
      let post = await Post.findById(pid);
      Post.uploadedImage(req, res, function (err) {
        if (err) {
          console.log("*****Multer Error in Post Image: ", err);
        }

        if (req.file) {
          if (post.postimage) {
            fs.unlinkSync(path.join(__dirname, "..", post.postimage));
          }

          post.postimage = Post.postimagePath + "/" + req.file.filename;
        }
        post.save();
        return res.redirect("back");
      });
    } catch (error) {
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorised");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    // .id means converting the object id into a string
    if (post.user == req.user.id) {
      // await Post.findOneAndDelete(post);
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.comments } });

      await Post.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }
      req.flash("success", "Post and associated comments deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post!");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in deleting the post");
    req.flash("error", err);
    return res.redirect("back");
  }
};
