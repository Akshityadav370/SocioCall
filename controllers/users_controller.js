const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
  let user = await User.findById(req.params.id);
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: user,
  });
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    // await User.findByIdAndUpdate(req.params.id, req.body);
    // req.flash("success", "Updated!");
    // return res.redirect("back");
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err){
        if(err) {console.log('****Multer Error: ', err)}

        // console.log(req.file);
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {

          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }

          // this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + '/' + req.file.filename
        }
        user.save();
        return res.redirect('back');
      })
    }catch(err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash("error", "Unauthorized!");
    return res.status(401).send("Unauthorised");
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_up", {
    title: "SocioCall | Sign Up",
  });
};

// render the sign in page
module.exports.singIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_in", {
    title: "SocioCall | Sign In",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }

  try {
    let user = User.findOne({ email: req.body.email });

    if (user) {
      User.create(req.body)
        .then((user) => {
          console.log("user created successfully:", user);
          return res.redirect("/users/sign-in");
        })
        .catch((err) => {
          req.flash("error", err);
          console.log("error in creating user while signing up");
          return;
        });
    } else {
      console.log("user already present:", user);
      req.flash('success', 'You have signed up, login to continue!');
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in finding user in signing up");
    return;
  }
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You have logged out!');
    res.redirect("/");
  });
};
