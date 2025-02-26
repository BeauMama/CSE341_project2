/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const app = express();
const swaggerAutogen = require('swagger-autogen')();
const SwaggerUIBundle = require('swagger-ui-dist').swaggerUi;

const doc = {
  swagger: '2.0',
  info: {
    title: 'My API',
    description: 'School API',
    version: '1.0.0',
  },
  host: process.env.RENDER_URL || 'localhost:3000',
  schemes: process.env.RENDER_URL ? ['https'] : ['http'],
  basePath: process.env.RENDER_URL ? '/api-docs' : '/api-docs',
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: {
        profile: 'View your basic profile info',
        email: 'View your email address',
      },
    },
  },
  security: [
    {
      OAuth2: ['profile', 'email'],
    },
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate the swagger.json file from the route definitions
swaggerAutogen(outputFile, endpointsFiles, doc);

// Serve the generated swagger.json file
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));

// Serve Swagger UI at /api-docs
app.use('/api-docs', SwaggerUIBundle({
  url: '/swagger.json', 
  dom_id: '#swagger-ui',
  deepLinking: true,
  presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
  layout: 'StandaloneLayout',
  oauth2RedirectUrl: process.env.NODE_ENV === 'production'
    ? 'https://cse341-project2-4wgf.onrender.com/oauth2/callback' 
    : 'http://localhost:3000/oauth2/callback',  

  requestInterceptor: (req) => {
    // Ensure credentials are included with the request to send cookies
    req.credentials = 'include';
    return req;
  },
}));


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
