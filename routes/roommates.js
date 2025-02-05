const express = require('express');
const router = express.Router();

const roommatesController = require('../controllers/roommates');

router.get('/', roommatesController.getAll);

router.get('/:id', roommatesController.getSingle);

router.post('/', roommatesController.createRoommate);

router.put('/:id', roommatesController.updateRoommate);

router.delete('/:id', roommatesController.deleteRoommate);

module.exports =router;