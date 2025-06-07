const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sanitizer = require("perfect-express-sanitizer");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); // pour pouvoir load des fichier yaml
const swaggerDocument = YAML.load('./swagger/railroad.yaml'); 
const errorHandler = require('./middlewares/errorHandler')
const { ERRORS } = require('./utils/errors'); 

require('dotenv').config();
require('./config/db'); 

const authRoutes = require('./routes/Auth');
const userRoutes = require('./routes/User');
const stationRoutes = require('./routes/Station');
const trainRoutes = require('./routes/Train');
const ticketRoutes = require('./routes/Ticket');
const trainController = require('./controllers/trainController');


const app = express();

app.use(methodOverride('_method'));
app.use(cors());
app.use(morgan('dev')); // logs des requêtes dans l'terminal 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    sanitizer.clean({   // https://www.npmjs.com/package/perfect-express-sanitizer
      xss: true,
      noSql: true,
      csrf: true
    })
  );

app.set('view engine', 'ejs');
app.set('views', './views'); 

app.use((req, res, next) => {
  res.locals.currentUrl = req.path;// je peux récupérer le path actuel dans toute mon appli pour pouvoir highlight des elements de mon header
  //https://codetofun.com/express/req/path/
  next();
});


app.get('/', trainController.getIndexPage); // render de la main page
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));//https://github.com/scottie1984/swagger-ui-express
app.use('/trains', trainRoutes);
app.use('/tickets', ticketRoutes);
app.use('/users', userRoutes);
app.use('/stations', stationRoutes);

app.use(authRoutes);
app.use('/uploads', express.static('public/uploads'));

app.use(express.static('public'));

app.use((req, res) => {
    res.status(ERRORS.ROUTE_NOT_FOUND.code).render('404', {
        error: ERRORS.ROUTE_NOT_FOUND
    });
});


app.use(errorHandler);

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});

module.exports = server; 