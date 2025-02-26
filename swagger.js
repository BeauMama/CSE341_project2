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

const ui = SwaggerUIBundle({
  url: "swagger.json", 
  dom_id: '#swagger-ui',
  deepLinking: true,
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIStandalonePreset
  ],
  layout: "StandaloneLayout",
  oauth2RedirectUrl: "http://localhost:3000/oauth2/callback", 
});

// Set the path for the generated swagger.json file
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate the swagger.json file from the route definitions
swaggerAutogen(outputFile, endpointsFiles, doc);
