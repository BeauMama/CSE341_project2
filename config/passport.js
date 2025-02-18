const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user.id);  
});

passport.deserializeUser((id, done) => {
  done(null, { id }); 
});

// Google OAuth strategy setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, 
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,  
},
(accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,  
  };
  return done(null, user);  
}));
