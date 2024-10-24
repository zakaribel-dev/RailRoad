const mongoose = require('mongoose');

const db = mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch(err => console.log('Erreur de connexion à la base de données :', err));

module.exports = db;