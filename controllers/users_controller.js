const User = require("../models/user");

module.exports.profile = async function (req, res) {
  const user = await User.findById(req.params.id);
  return res.render('user_profile', {
    title: 'User Profile',
    profile_user: user
  });
};

module.exports.update =async function(req, res) {
  if (req.user.id == req.params.id) {
    await User.findByIdAndUpdate(req.params.id, req.body);
    return res.redirect('back');
  }else{
    return res.status(401).send('Unauthorised');
  }
}

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
    return res.redirect("back");
  }

  try{
    const user = User.findOne({email: req.body.email});

    if (user) {
        User.create(req.body)
            .then((user)=>{
                console.log('user created successfully:', user);
                return res.redirect('/users/sign-in');
            }).catch((err)=>{
                console.log('error in creating user while signing up');
                return;
            });
    } else {
        console.log('user already present:', user);
        return res.redirect('back');
    }
  }
  catch(err) {
    console.log("error in finding user in signing up");
      return;
  }
};

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
};
