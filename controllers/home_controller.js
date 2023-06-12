const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
      })
      .populate("likes");
    // console.log("posts ----------------->", posts);

    let users = await User.find({});
    let usersFriendships;
    // console.log("users ------------------>", users);
    // console.log("posts.com");

    if (req.user) {
      usersFriendships = await User.findById(req.user._id).populate({
        path: "friendships",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "from_user to_user",
        },
      });
    }

    return res.render("home", {
      title: "SocioCall | Home",
      posts: posts,
      all_users: users,
      myUser: usersFriendships
    });
  } catch (error) {
    console.log("Error in home controller", error);
  }
};

// module.exports.actionName = function (req, res) {}
