const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    // populate the user of each post
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');
    console.log("posts ----------------->", posts);

    let users = await User.find({});
    console.log("users ------------------>", users);
    console.log("posts.com");
    return res.render("home", {
      title: "SocioCall | Home",
      posts: posts,
      all_users: users,
    });
  } catch (error) {
    console.log("Error in home controller", error);
  }
};

// module.exports.actionName = function (req, res) {}
