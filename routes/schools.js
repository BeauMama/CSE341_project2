const express = require('express');
const router = express.Router();

const schoolsController = require('../controllers/schools');

router.get('/', schoolsController.getAll);

router.get('/:id', schoolsController.getSingle);

router.post('/', schoolsController.createSchool);

router.put('/:id', schoolsController.updateSchool);

router.delete('/:id', schoolsController.deleteSchool);

module.exports =router;