const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start the Google authentication process
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'], 
}));

// Google authentication callback route
router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/login', 
  }),
  (req, res) => {

    res.redirect('/api-docs'); 
  }
);

module.exports = router;
