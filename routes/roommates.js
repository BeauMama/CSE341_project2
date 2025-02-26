const express = require('express');
const validateRoommate = require('../validators/roommatesValidator');
const handleValidationErrors = require('../middleware/validationMiddleware');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const roommatesController = require('../controllers/roommates');

//Get Routes
router.get('/', roommatesController.getAll);
router.get('/:id', roommatesController.getSingle);

//Protected Routes
router.post('/', authenticate, validateRoommate, handleValidationErrors, roommatesController.createRoommate);
router.put('/:id',authenticate, validateRoommate, handleValidationErrors, roommatesController.updateRoommate);
router.delete('/:id',authenticate, roommatesController.deleteRoommate);

module.exports =router;