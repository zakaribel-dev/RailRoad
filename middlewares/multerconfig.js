const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid"); // pr générer fichier unique
const path = require("path");
const { ERRORS, createErrorResponse } = require("../utils/errors");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${uuidv4()}.jpeg`;

  // besoin du chemin absolu pour écrire sur la machine (different d'un traitement purement http)
  const UPLOADS_DIR = path.join(__dirname, "../public/uploads");

  try {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(UPLOADS_DIR, req.file.filename));

    next();
  } catch (error) {
    const err = { ...ERRORS.IMAGE_PROCESSING_ERROR, status: 500 };

    if (req.headers.accept.includes("application/json")) {
      return res
        .status(err.status)
        .json(createErrorResponse(err, error.message));
    }

    return res.redirect("/?error=Problème avec votre fichier.");
  }
};

module.exports = { upload, resizeImage };
