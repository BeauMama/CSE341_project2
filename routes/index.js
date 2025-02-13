const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

router.use('/schools',require('./schools'));
router.use('/roommates',require('./roommates'));

module.exports = router;
