const passport = require('passport');
const githubStrategy = require('passport-github').Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(
    new githubStrategy({
        clientID: "103164d559982911f855",
        clientSecret: "debc2dad3e770e96ac8a270661d946a062a7452c",
        callbackURL: "http://localhost:8001/users/auth/github/callback"
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
          // find a user
          let user = await User.findOne({ githubId: profile.id });
  
          console.log(profile);
  
          if (user) {
            // if found, set this user as req.user
            return done(null, user);
          } else {
            // if not found, create the user & set it as req.user
            try {
              let user = await User.create({
                name: profile.displayName,
                email: profile.profileUrl.value,
                password: crypto.randomBytes(20).toString("hex"),
                scope: [ 'user:email' ]
              });
  
              if (user) {
                return done(null, user);
              }
            } catch (error) {
              console.log("error in creating user github strategy-passport", error);
              return;
            }
          }
        } catch (error) {
          console.log("error in github strategy-passport", error);
          return;
        }
      }
    )
);

module.exports = passport;