var FacebookStrategy = require( 'passport-facebook' ).Strategy;
var LocalStrategy = require( 'passport-local' ).Strategy;

var FACEBOOK_APP_ID = '448273185359100';
var FACEBOOK_APP_SECRET = '8a97fd620f3e328e850b1f1d57c8a0ce';

module.exports = function ( passport ) {
  passport.serializeUser( function ( user, done ) {
    done( null, user );
  } );

  passport.deserializeUser( function ( obj, done ) {
    done( null, obj );
  } );

  passport.use( new FacebookStrategy( {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      //callbackURL: "http://localhost:3000/auth/facebook/callback",
      callbackURL: "http://167.160.162.251:4001/auth/facebook/callback",
      enableProof: false,
      profileFields: [ 'id', 'displayName', 'gender', 'email', 'first_name', 'last_name', 'birthday', 'location', 'picture.type(large)' ]
        //https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        //https://developers.facebook.com/docs/graph-api/reference/user
    },
    function ( accessToken, refreshToken, profile, done ) {
      console.log('PERFIL: '+ JSON.stringify(profile));
      if (profile._json.gender != ""){
        if ( profile._json.gender == 'female' ) {
          profile._json.gender = 'F';
        }
        else {
          profile._json.gender = 'M';
        }
      }
      return done( null, profile._json );
    }
  ) );

  passport.use( new LocalStrategy(
    function ( username, password, done ) {
      if ( username === 'test' && password === 'test' ) {
        var user = {
          'name': username
        }
        return done( null, user );
      }
      else {
        return done( null, false );
      }
    }
  ) );
}
