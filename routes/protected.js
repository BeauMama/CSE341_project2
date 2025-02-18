const express = require('express');
const router = express.Router();

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


// Dashboard route
router.get('/dashboard', (req, res) => {
    // Assuming the profile is stored temporarily in the session
    if (req.user) {
        res.send(`Welcome ${req.user.displayName}`);  // Use `req.user` directly
    } else {
        res.send('No user logged in');
    }
});

// Example protected profile route
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(`Profile of ${req.user.displayName}`);
});


module.exports = router;
