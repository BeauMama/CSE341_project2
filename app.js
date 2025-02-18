/* eslint-disable no-console */
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();

require('./config/passport');

const app = express();

// Middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Define the login route
app.get('/login', (req, res) => {
  res.send('Please log in!');
});

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');  // Redirect to login if not authenticated
}

// Protected routes (requires authentication)
app.use('/api-docs', ensureAuthenticated, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Google authentication routes
app.use('/auth', require('./routes/auth'));  // Make sure this is in your 'auth.js' file

// Other routes
app.use('/', require('./routes/protected'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
