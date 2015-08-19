var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

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
        enableProof: false,
        profileFields: ['id', 'displayName','gender','email','first_name','last_name','birthday','location']
        //https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        //https://developers.facebook.com/docs/graph-api/reference/user
      },
      function(accessToken, refreshToken, profile, done) {
          return done(null, profile._json);
      }
    ));

    passport.use(new LocalStrategy(
        function(username, password, done) {
            if (username === 'test' && password === 'test'){
                var user = {'name' : username}
                return done(null,user);
            } else {
                return done(null,false);
            }
        }
    ));
}
