const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;

const ExtractJWT = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "sociocall",
};

passport.use(
  new JWTStrategy(opts, async function (jwtPayLoad, done) {
    try {
      let user = await User.findById(jwtPayLoad._id);

      if (user) {
        return done(null, err);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log("Error in finding user from JWT");
      return;
    }
  })
);

module.exports = passport;
