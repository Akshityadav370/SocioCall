const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

// authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    function (req, email, password, done) {
      // find a user and establish the identity
      // try {
      //   const user = User.findOne({email: email}).populate("password");

      //   if (user.password != password) {
      //     console.log("Invalid Username/Password");
      //     console.log(password, user.password, user.email, email, user);
      //     return done(null, false);
      //   }

      //   return done(null, user);
      // }
      // catch (err) {
      //   console.log("Error in finding user --> Passport");
      //     return done(err);
      // }
      User.findOne({email: email})
        .then((user)=>{
            if( !user || user.password != password){
                console.log('Invalid username/password');
                req.flash('error', 'Invalid username/password');
                return done(null, false); // authentication is false
            }

            return done(null, user);
        })
        .catch((err)=>{
            console.log('Error in finding the user ----> Passport');
            req.flash('error', err);
            return done(err);
        })
    }
  )
);

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  // User.findById(id, function (err, user) {
  //   if (err) {
  //     console.log("Error in finding user --> Passport");
  //     return done(err);
  //   }

  //   return done(null, user);
  // });
  await User.findById(id)
    .then((user)=>{
        return done(null, user);
    })
    .catch((err)=>{
        console.log('Error in finding the user ----> Passport');
        return done(err);
    })
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
