/* eslint-disable no-console */
const express = require('express');
const path = require('path');  
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');  
const listEndpoints = require('express-list-routes');
const { initDb } = require('./db/connect');
const util = require('util');

dotenv.config();
require('./config/passport');

const app = express();

// Serve the swagger.json file at /swagger.json
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));

// Trust proxy for Render.com deployment
app.set('trust proxy', 1);

// Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://cse341-project2-4wgf.onrender.com'
    : 'http://localhost:3000',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    sameSite: 'lax', 
    path: '/', 
  }
}));


app.use(passport.initialize());
app.use(passport.session());

// Login route to initiate OAuth
app.get('/login', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Google authentication route
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth2 callback route
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: '/api-docs',
}));

// Include all routes from 'routes/index.js'
app.use('/', require('./routes'));

// Protect Swagger UI route
app.use('/api-docs', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.send(`
      <html>
        <head>
          <title>Schools and Roommates API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css" />
        </head>
        <body>
          <!-- Logout link at the top -->
          <div style="text-align: right; padding: 10px;">
            <a href="/logout">Logout</a>
          </div>

          <div id="swagger-ui"></div>

          <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
          <script>
            const ui = SwaggerUIBundle({
              url: '/swagger.json',  // Ensure this matches the static route
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis
              ],
            });
          </script>
        </body>
      </html>
    `);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  console.log('Logout route initiated');
  
  // Make sure user is logged out from passport session
  req.logout((err) => {
    if (err) {
      console.error('Error during logout process:', err);
      return res.status(500).json({ message: 'Error logging out', error: err });
    }
    console.log('User successfully logged out from passport session');
    
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error destroying session', error: err });
      }
      console.log('Session destroyed');

      // Explicitly clear the session cookie 'connect.sid'
      res.clearCookie('connect.sid', { path: '/', domain: 'localhost' });
      console.log('Session cookie (connect.sid) cleared for localhost');

      // Optionally clear any other authentication-related cookies
      res.clearCookie('googleToken', { path: '/', domain: 'localhost' });
      console.log('OAuth cookie (googleToken) cleared');

      // Redirect the user to the login page
      res.redirect('/login');
      console.log('User redirected to login');
    });
  });
});




// List all routes (should be called after all routes are initialized)
listEndpoints(app);

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// General error handling middleware (catch-all for errors)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  const errorObject = {
    message: err.message,
    stack: err.stack,
  };

  console.log(util.inspect(errorObject, { showHidden: false, depth: 2 }));

  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Initialize the database before starting the server
initDb()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error initializing DB:', err);
    process.exit(1);
  });
