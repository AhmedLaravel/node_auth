const passport = require("passport");
const passportJWT = require("passport-jwt");
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userSequlizer = require("../Sequelizer/user.sequelizer");
module.exports.initPassport = function (app) {
    app.use(passport.initialize());
    
    passport.use('jwt', new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET
    },
      function (jwtPayload, done) {
        return done(null, jwtPayload);
      }
    ));
}

//--------------------Facebook Strategy--------------------
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.WEB_URL + '/api/facebook/callback',
    profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],
    passReqToCallback: true
  },
     (req, accessToken, refreshToken, profile, done) => {
       process.nextTick(async  () => {
         console.log("Facebook authentication triggered")
         try {
           // Check if the fb profile has an email associated. Sometimes FB profiles can be created by phone.
           if (!profile._json.email) {
             return done(null, false,
              { message: 'Facebook Account is not registered with email. Please sign in using other methods' })
            }
            let data = await userSequlizer.getOrCreateNewUser(profile._json,'facebook')// An optional param you can pass to the request
          if(data.alreadyRegisteredError){
            // You can also support logging the user in and overriding the login medium
            done(null, false, {
              message: `Email is alredy registered. Please login with email.`
            });
          } else {
            done(null, {id:data.user.id, name:data.user.name, email:data.user.email, accessToken:accessToken, refreshToken:refreshToken}, {message:"User logged in successfully"})
          }
        } catch (err) {
          return done(null, null, {message: err.message})
        }
      });
    }
  ));
//--------------------Google Strategy--------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: process.env.WEB_URL + '/api/google/callback',
  passReqToCallback: true
},
  function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      console.log("google authentication triggered")
         try {
           // Check if the fb profile has an email associated. Sometimes FB profiles can be created by phone.
           if (!profile._json.email) {
             return done(null, false,
              { message: 'Google Account is not registered with email. Please sign in using other methods' })
            }
            let data = await userSequlizer.getOrCreateNewUser(profile._json,'google')// An optional param you can pass to the request
          if(data.alreadyRegisteredError){
            // You can also support logging the user in and overriding the login medium
            done(null, false, {
              message: `Email is alredy registered. Please login with email.`
            });
          } else {
            done(null, {id:data.user.id, name:data.user.name, email:data.user.email, accessToken:accessToken, refreshToken:refreshToken}, {message:"User logged in successfully"})
          }
        } catch (err) {
          return done(null, null, {message: err.message})
        }
    });
  }
));

