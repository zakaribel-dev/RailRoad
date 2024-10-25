const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        req.user = { id: new mongoose.Types.ObjectId(), role: 'admin' }; // Fake user pour les test
        return next();
    }

    const token = req.cookies.jwt;
    if (!token) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ message: 'Vous devez vous connecter!' });
        } else {
            return res.redirect('/login?message=Vous devez vous connecter');
        }
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: verified.id, role: verified.role, username: verified.username };
        next();
    } catch (error) {
        console.log('Invalid token:', error.message);
    }
};

module.exports = authMiddleware;
