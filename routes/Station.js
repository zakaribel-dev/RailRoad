const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require('../middlewares/admin');
const getUserInfos = require ('../middlewares/getUserInfos')
const { upload, resizeImage } = require('../middlewares/multerconfig');

// getUserInfos c'est un middleware souple qui va principalement me permettre de recuperer le role du user
// pour ma vue afin d'afficher les boutons d'actions ou non (par rapport à si l'utilisateur est admin ou non)
router.get("/", getUserInfos, stationController.getAllStations); 

router.get("/create", authMiddleware,adminMiddleware, stationController.renderCreateStationForm);

router.post("/", authMiddleware,adminMiddleware, upload.single('image'), resizeImage, stationController.createStation);

router.get("/:stationId/edit", authMiddleware,adminMiddleware, stationController.renderEditStationForm);
router.put("/:stationId", authMiddleware,adminMiddleware, upload.single('image'), resizeImage, stationController.updateStation);
router.delete("/:stationId", authMiddleware, adminMiddleware, stationController.deleteStation);

module.exports = router;
