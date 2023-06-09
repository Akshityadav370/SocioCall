const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    req.flash("success", "Post published!");
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    console.log("error in creating a post");
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    // .id means converting the object id into a string
    if (post.user == req.user.id) {
      // await Post.findOneAndDelete(post);
      await Post.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ post: req.params.id });
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
