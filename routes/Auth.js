const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userCreateSchema } = require('../validations/userValidation');
const validationMiddleware = require('../middlewares/validate');

router.get('/register', userController.renderRegister); 

router.post('/register', validationMiddleware(userCreateSchema), userController.registerUser);

router.get('/login', userController.renderLogin); 

router.post('/login', userController.loginUser);

router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); 
    res.redirect('/login');
});

module.exports = router;
