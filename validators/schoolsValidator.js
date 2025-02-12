const {body} = require('express-validator');

const validateSchool = [    
    body('name')
        .isString()
        .isLength({min: 3})
        .withMessage('Name must be at least 3 characters long'),
    body('location')
        .isString()
        .isLength({min: 3})
        .withMessage('Location must be at least 3 characters long'),
    body('established')
        .isInt({min: 1000, max: 9999})
        .withMessage('Established must be a 4-digit number'),
    body('type')
        .isString()
        .isLength({min: 3})
        .withMessage('Type must be at least 3 characters long'),
    body('student_population')
        .isInt()
        .withMessage('Students must be a number'),
    body('website')
        .isURL({ require_protocol: true })  
        .withMessage('Website must be a valid URL starting with http:// or https://'),
    body('mascot')
        .isString()
        .isLength({min: 3})
        .withMessage('Mascot must be at least 3 characters long')
];

module.exports = validateSchool;