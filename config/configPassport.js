var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '717734195021820';
var FACEBOOK_APP_SECRET = 'e97243728bf098efdcf6b2141fbb13ac';

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        enableProof: false
      },
      function(accessToken, refreshToken, profile, done) {
        return done(null, profile._json);
      }
    ));


}
