const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;

const crypto = require("crypto");

const User = require("../models/user");

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID:
        "206308146759-opl0csegn6qthb0rjsjcmc6hput45bjk.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8001/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // find a user
        let user = await User.findOne({ email: profile.emails[0].value });

        console.log(profile);

        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user & set it as req.user
          try {
            let user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            });

            if (user) {
              return done(null, user);
            }
          } catch (error) {
            console.log("error in creating user google strategy-passport", err);
            return;
          }
        }
      } catch (error) {
        console.log("error in google strategy-passport", error);
        return;
      }
    }
  )
);



module.exports = passport;
