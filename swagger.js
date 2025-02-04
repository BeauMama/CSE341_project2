const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Contact API',
  },
  host: process.env.RENDER_URL || 'localhost:3000',
  schemes: process.env.RENDER_URL ? ['https'] : ['http'],
  basePath: process.env.RENDER_URL ? '/api-docs' : '/api-docs',
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];


swaggerAutogen(outputFile, endpointsFiles, doc);

