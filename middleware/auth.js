const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        logger.warn('No token, authorization denied');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        logger.error('Token is not valid:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
}; 