const express = require('express');
const validateSchool = require('../validators/schoolsValidator');
const handleValidationErrors = require('../middleware/validationMiddleware');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

const schoolsController = require('../controllers/schools');


//Get Routes
router.get('/', schoolsController.getAll);
router.get('/:id', schoolsController.getSingle);

//Protected Routes
router.post('/',authenticate, validateSchool, handleValidationErrors, schoolsController.createSchool);
router.put('/:id',authenticate, validateSchool, handleValidationErrors, schoolsController.updateSchool);
router.delete('/:id',authenticate, schoolsController.deleteSchool);

module.exports =router;