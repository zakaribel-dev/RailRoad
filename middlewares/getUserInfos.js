const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUserInfos = async (req, res, next) => {
    const token = req.cookies.jwt;  

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = await User.findById(decoded.id);  
        } catch (err) {
            req.user = null;  
        }
    } else {
        req.user = null;  
    }

    next();  
};

module.exports = getUserInfos;
