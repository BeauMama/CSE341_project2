const express = require('express');
const validateSchool = require('../validators/schoolsValidator');
const handleValidationErrors = require('../middleware/validationMiddleware');
const router = express.Router();

const schoolsController = require('../controllers/schools');



router.get('/', schoolsController.getAll);

router.get('/:id', schoolsController.getSingle);

router.post('/', validateSchool, handleValidationErrors, schoolsController.createSchool);

router.put('/:id', validateSchool, handleValidationErrors, schoolsController.updateSchool);

router.delete('/:id', schoolsController.deleteSchool);

module.exports =router;