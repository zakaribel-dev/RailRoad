const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');
const validationMiddleware = require('../middlewares/validate');
const { trainSchema } = require('../validations/trainValidation');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const getUserInfos = require ('../middlewares/getUserInfos')

router.get('/getAll',trainController.getIndexPage);

router.get('/create', authMiddleware, adminMiddleware, trainController.renderCreateTrainForm);

// getUserInfos c'est un middleware souple qui va principalement me permettre de recuperer le role du user
// pour ma vue afin d'afficher les boutons d'actions ou non (par rapport à si l'utilisateur est admin ou non)
router.get('/', getUserInfos,trainController.handleTrains);

router.get('/:trainId', trainController.getTrainById);

router.post('/', authMiddleware, adminMiddleware, validationMiddleware(trainSchema), trainController.createTrain);
router.get('/:trainId/edit', authMiddleware, adminMiddleware, trainController.renderEditTrainForm);

router.put('/:trainId', authMiddleware, adminMiddleware, validationMiddleware(trainSchema), trainController.updateTrain);

router.delete('/:trainId', authMiddleware, adminMiddleware, trainController.deleteTrain);

module.exports = router;