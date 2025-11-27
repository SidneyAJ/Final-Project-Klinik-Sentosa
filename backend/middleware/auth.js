const jwt = require('jsonwebtoken');

const SECRET_KEY = 'klinik_sentosa_secret_key_change_in_production';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}

function isPharmacist(req, res, next) {
    if (req.user.role !== 'apoteker') {
        return res.status(403).json({ error: 'Access denied. Pharmacist role required.' });
    }
    next();
}

module.exports = { authenticateToken, isPharmacist, SECRET_KEY };
