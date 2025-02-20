/* eslint-disable no-console */
require('dotenv').config();
const { MongoClient } = require('mongodb');

let _db;

const initDb = async () => {
    if (_db) {
        // Return existing database instance if already initialized
        return _db;
    }

    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        _db = client.db(process.env.DATABASE);  
        console.log('Connected to the database');
        return _db;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw new Error('Failed to initialize database');
    }
};

const getDb = () => {
    if (!_db) {
        throw new Error('Database not initialized!!');
    }
    return _db;
};

module.exports = { initDb, getDb };
