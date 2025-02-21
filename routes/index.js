const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

router.use('/schools',require('./schools'));
router.use('/roommates',require('./roommates'));
router.use('/auth',require('./auth'));
router.use('/protected',require('./protected'));

module.exports = router;
