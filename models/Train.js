const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start_station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true }, 
    end_station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    time_of_departure: { type: Date, required: true }
});

// le type mongoose.Schema.Types.ObjectId c'est comme si je déclarais une foreign key en sql. ca fait reference à l'id de la station (objectId)
// du coup je peux récuperer le nom de la station via start_station.name par exemple mais à condition d'avoir fait un populate("start_station")
// pour "populer" start_station de toute les infos de la station en question start_station contiendra alor un objet des infos de la station en question
// check ici https://www.slingacademy.com/article/mongoose-reference-a-schema-in-another-schema-with-examples/


const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
