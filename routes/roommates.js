const express = require('express');
const validateRoommate = require('../validators/roommatesValidator');
const handleValidationErrors = require('../middleware/validationMiddleware');
const router = express.Router();

const roommatesController = require('../controllers/roommates');

router.get('/', roommatesController.getAll);

router.get('/:id', roommatesController.getSingle);

router.post('/', validateRoommate, handleValidationErrors, roommatesController.createRoommate);

router.put('/:id', validateRoommate, handleValidationErrors, roommatesController.updateRoommate);

router.delete('/:id', roommatesController.deleteRoommate);

module.exports =router;