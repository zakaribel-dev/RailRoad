const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');
const validationMiddleware = require('../middlewares/validate');
const { trainSchema } = require('../validations/trainValidation');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

router.get('/getAll',trainController.getIndexPage);

router.get('/create', authMiddleware, adminMiddleware, trainController.renderCreateTrainForm);

router.get('/', authMiddleware,trainController.handleTrains);// endpoint perso (pour le front car ça me semble plus cohérent de se
// connecter pour la gestion des trains)

router.get('/:trainId', trainController.getTrainById);

router.post('/', authMiddleware, adminMiddleware, validationMiddleware(trainSchema), trainController.createTrain);
router.get('/:trainId/edit', authMiddleware, adminMiddleware, trainController.renderEditTrainForm);

router.put('/:trainId', authMiddleware, adminMiddleware, validationMiddleware(trainSchema), trainController.updateTrain);

router.delete('/:trainId', authMiddleware, adminMiddleware, trainController.deleteTrain);

module.exports = router;