/* eslint-disable no-console */
const express = require('express');
const mongodb = require('./db/connect')
const cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//middleware
app.use(cors());
app.use(express.json());

//Set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

//Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Routes
app.use('/', require('./routes/'));

//Error handling middleware
app.use((err, req, res, next) => {  
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        message: err.message || 'Something went wrong',
        error: err.stack || err,
  });
});


mongodb.initDb((err) => {
    if(err) {
        console.error('Failed to connect to the database', err);
         return;
    }  
        
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
});
});