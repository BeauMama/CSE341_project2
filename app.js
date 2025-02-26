/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const listEndpoints = require('express-list-routes');
const { initDb } = require('./db/connect');

dotenv.config();
require('./config/passport');

const app = express();

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
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirect unauthorized users
};

// Define the login route
app.get('/login', (req, res) => {
  res.send('Please log in!');
});

// Include all routes from 'routes/index.js'
app.use('/', require('./routes'));

// Protected route: Serve Swagger UI only for authenticated users
app.use('/api-docs', ensureAuthenticated, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// List all routes (should be called after all routes are initialized)
listEndpoints(app);

// Handle 404 errors for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// General error handling middleware (catch-all for errors)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
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
