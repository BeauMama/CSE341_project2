const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user.id);  // Store the user's ID in the session
});

passport.deserializeUser((id, done) => {
  done(null, { id });  // Here, we just retrieve the user ID from the session
});

// Google OAuth strategy setup
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Make sure this is in your .env file
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,  // Callback URL after Google login
},
(accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    email: profile.emails[0].value,  // Save the email if needed
  };
  return done(null, user);  // Pass the user object into the session
}));
