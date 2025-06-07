const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        req.user = { id: new mongoose.Types.ObjectId(), role: 'admin' }; // Fake user pour les tests
        return next();
    }

    let token = req.cookies.jwt;

    if (req.headers.accept && req.headers.accept.includes('application/json')) { // postman 
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Token manquant dans l\'en-tête Authorization !' });
        }
// espace entre bearer et le token du coup split creer l'array et utilise l'espace comme separator jrecupere le token à l'index 1
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.redirect('/?message=Vous devez vous connecter !&error=true');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: verified.id, role: verified.role, username: verified.username };
        next();
    } catch (error) {
        console.log('Invalid token:', error.message);
        return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

module.exports = authMiddleware;
