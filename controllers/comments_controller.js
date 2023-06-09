const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");
const Like = require("../models/like")

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      if (comment) {
        post.comments.push(comment);
        post.save();

        comment = await comment.populate("user", "name email").execPopulate();

        // console.log("comment----------------->", comment);
        // comment = await comment.populate("user", "name email").execPopulate();
        // commentsMailer.newComment(comment);
        if (req.xhr) {
          // Similar for comments to fetch the user's id!
          // comment = await comment.populate("user", "name email").execPopulate();

          // commentsMailer.newComment(comment);
          

          return res.status(200).json({
            data: {
              comment: comment,
            },
            message: "Post created!",
          });
          
        }
        req.flash("success", "Comment published!");
        res.redirect("/");
      }
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect('/');
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.query.commentId);

    if (comment.user == req.user.id) {
      let postId = comment.post;

      // comment.remove();
      Comment.findOneAndDelete(comment);

      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.query.commentId },
      });

      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      req.flash("success", "Comment deleted!");

      return res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error in destroying comments", error);
    console.log('error in destroying comments',error);
    return res.redirect("back");

  }
};
