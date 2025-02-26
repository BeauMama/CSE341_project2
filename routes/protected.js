const express = require('express');
const router = express.Router();

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
}


// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

// Example protected profile route
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`Profile of ${req.user.displayName}`);
});


module.exports = router;
