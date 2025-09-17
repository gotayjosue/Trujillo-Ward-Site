const { body, validationResult } = require('express-validator');

const validate = {};

// Reglas para registro
validate.registrationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Name must be 3-50 characters'),
  body('email')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

// Reglas para login
validate.loginRules = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Middleware para revisar los resultados
validate.check = (fallback) => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error_msg', errors.array().map(err => err.msg));
    return res.redirect(req.header('Referer') || fallback); // vuelve al formulario actual
  }
  next();
};

module.exports = validate;