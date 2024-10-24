const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        if (req.headers.accept && req.headers.accept.includes('application/json')) { // Pour Postman
            return res.status(200).json({ message: 'Action refusée, vous devez être admin' }); 
        }
       return res.redirect('/?message=Action refusée, vous devez être admin !');
    }
};

module.exports = adminMiddleware;
