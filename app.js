/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { initDb } = require('./db/connect');

dotenv.config();
require('./config/passport');

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://cse341-project2-4wgf.onrender.com'
    : 'http://localhost:3000',
  credentials: true
}));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); 
}

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('🔍 Session Data:', req.session);
  console.log('🔍 User in Session:', req.user);
  next();
});


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Routes
app.get('/login', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Start Google authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['openid','profile', 'email'] }));

// Callback route for Google authentication
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), 
  (req, res) => {
   
    console.log('Logged in user:', req.user);  
    res.redirect('/api-docs');  
  }
);


// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return next(err);
    }
    req.session = null; 
    res.clearCookie('connect.sid');
    res.redirect('/api-docs');
  });
});



// Middleware to check authentication
const authenticate = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized: Please log in" });
  }
  next();
};

// Routes
app.use('/', require('./routes'));


// Serve the dynamically filtered Swagger JSON
app.use('/swagger.json', (req, res) => {
  console.log('Checking authentication for Swagger:', req.user);  // Debugging

  //const isAuthenticated = req.user ? true : false;  // Use req.user to check authentication

  let swaggerDoc = JSON.parse(JSON.stringify(swaggerDocument)); 

  if (!req.user) {
    Object.keys(swaggerDoc.paths).forEach((path) => {
      ['post', 'put', 'delete'].forEach((method) => {
        if (swaggerDoc.paths[path][method]) {
          delete swaggerDoc.paths[path][method];
        }
      });
    });
  }

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.json(swaggerDoc);
});


// Serve Swagger UI with login/logout links
app.get('/api-docs', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css" />
      </head>
      <body>
        <div style="text-align: right; padding: 10px;">
          ${req.isAuthenticated() 
            ? `<a href="/logout">Logout</a>` 
            : `<a href="/login">Login</a>`}
        </div>

        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: '/swagger.json', // Load the filtered Swagger JSON
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis],
          });
        </script>
      </body>
    </html>
  `);
});

// Handle 404 errors
app.use((req, res) => {res.status(404).json({ message: 'Route not found' });});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Initialize the database and start the server
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
