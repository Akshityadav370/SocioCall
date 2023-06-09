const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  const posts = await Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  const users = await User.find({});

  return res.render("home", {
    title: "SocioCall | Home",
    posts: posts,
    all_users: users,
  });
};

// module.exports.actionName = function (req, res) {}
