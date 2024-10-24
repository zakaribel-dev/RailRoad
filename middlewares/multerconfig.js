const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid') // pr générer fichier unique
const path = require('path');


const storage = multer.memoryStorage(); 

const upload = multer({ storage });

const resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `${uuidv4()}.jpeg`; 

    // besoin du chemin absolu pour écrire sur la machine (different d'un traitement purement http)
    const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

    try {
        await sharp(req.file.buffer)
            .resize(200, 200)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(path.join(UPLOADS_DIR, req.file.filename));

        next(); 
    } catch (error) {
        
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(500).json({ message: 'Erreur lors du traitement de l’image', error: error.message });
        }
        console.error('Erreur lors du traitement de l’image:', error);

        return res.redirect('/?error=Problème avec votre fichier.');
    }
};

module.exports = { upload, resizeImage };
