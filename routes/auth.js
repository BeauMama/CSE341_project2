/* eslint-disable no-console */
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

// Logout Route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      console.error('Logout error:', err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.redirect('/'); 
    });
  });
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
