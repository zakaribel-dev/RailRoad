const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validationMiddleware = require('../middlewares/validate');
const { userUpdateSchema } = require('../validations/userValidation');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

 // me = mon profile 

router.get('/me', authMiddleware, userController.getUserProfile);
router.get('/:id', authMiddleware, userController.getUserProfile);
router.put('/me', authMiddleware, validationMiddleware(userUpdateSchema), userController.updateProfile);
router.delete('/me', authMiddleware, userController.deleteProfile);
router.put('/:id', authMiddleware,adminMiddleware, validationMiddleware(userUpdateSchema), userController.updateProfile);
router.delete('/:id', authMiddleware,adminMiddleware, userController.deleteProfile);


module.exports = router;
