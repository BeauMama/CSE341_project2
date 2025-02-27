/* eslint-disable no-console */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

dotenv.config();

// Google OAuth strategy setup
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
      ? process.env.GOOGLE_CALLBACK_URL
      : 'http://localhost:3000/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value || null, 
    };
    // Log the user profile for debugging
    console.log('Google Profile:', profile);
    
    return done(null, user);
  }
));

// Passport session handling
passport.serializeUser((user, done) => {
  console.log('✅ Serializing User:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('✅ Restoring User:', user);
  done(null, user); 
});