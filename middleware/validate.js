const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

module.exports = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}; 