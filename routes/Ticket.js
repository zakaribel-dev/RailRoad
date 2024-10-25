const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, ticketController.renderTicketForm); 
router.get('/validate', authMiddleware, ticketController.renderValidateTicketForm); 
router.post('/validate', authMiddleware, ticketController.validateTicket); // pour postman faut fournir l'id du ticket comme ça :
//{
//   "ticketId": "<ticketId>"
//  }

router.post('/', authMiddleware, ticketController.bookTicket); // pour postman faut fournir le trainId comme ça :
   //{
  //   "trainId": "<trainId>"
 //  }
  
module.exports = router;
