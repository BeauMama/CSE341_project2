const {body} = require('express-validator');

const validateRoommate = [
    body('name')
        .isString()
        .isLength({min: 3})
        .withMessage('Name must be at least 3 characters long'),
    body('age')
        .isInt()
        .withMessage('Age must be a number'),
    body('major')
        .isString()
        .isLength({min: 3})
        .withMessage('Major must be at least 3 characters long'),
    body('contact.email')
        .isEmail()
        .withMessage('Email is required'),
    body('contact.phone')
        .matches(/^\d{3}-\d{3}-\d{4}$/)  
        .withMessage('Phone number must be in the format XXX-XXX-XXXX')
      ,
];

module.exports = validateRoommate;