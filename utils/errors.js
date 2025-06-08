const ERRORS = {
  USER_NOT_FOUND: {
    code: 9,
    status: 404,
    message: "Utilisateur introuvable",
  },
  EMAIL_ALREADY_USED: {
    code: 5,
    status: 400,
    message: "Cet email est déjà utilisé",
  },
  WRONG_PASSWORD: {
    code: 10,
    status: 401,
    message: "Mot de passe incorrect",
  },
  TRAIN_NOT_FOUND: {
    code: 20,
    status: 404,
    message: "Train non trouvé",
  },
  STATION_NOT_FOUND: {
    code: 21,
    status: 404,
    message: "Station introuvable",
  },
  STATION_LINKED_TO_TRAIN: {
    code: 22,
    status: 400,
    message:
      "Cette station est liée à un ou plusieurs trains ou tickets et ne peut pas être supprimée",
  },
  TICKET_NOT_FOUND: {
    code: 30,
    status: 404,
    message: "Ticket introuvable",
  },
  INTERNAL_SERVER: {
    code: 74,
    status: 500,
    message: "Erreur serveur",
  },
  FETCH_TRAIN_ERROR: {
    code: 75,
    status: 500,
    message: "Erreur lors de la récupération des trains",
  },
  FRONTEND_TRAIN_ERROR: {
    code: 76,
    status: 500,
    message: "Erreur lors du rendu frontend des trains",
  },
  ROUTE_NOT_FOUND: {
    code: 404,
    status: 404,
    message: "Route non trouvée",
  },
  ACCESS_DENIED: {
    code: 403,
    status: 403,
    message: "Accès refusé",
  },
  IMAGE_PROCESSING_ERROR: {
    code: 80,
    status: 500,
    message: "Erreur lors du traitement de l’image",
  },
};

const createErrorResponse = (error) => ({
  error: error.code,
  error_message: error.message,
});

module.exports = { ERRORS, createErrorResponse };
