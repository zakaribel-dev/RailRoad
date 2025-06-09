const { createErrorResponse } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  console.error(err);

  const status = err.status;

  const encodedMessage = encodeURIComponent(err.message);

  //  requêtes api via postman par exmple
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(status).json(createErrorResponse(error));
  }

  if (req.originalUrl.includes("/login")) {
    return res.redirect(`/login?message=${encodedMessage}`);
  }

  if (req.originalUrl.includes("/register")) {
    return res.redirect(`/register?message=${encodedMessage}`);
  }

  if (req.originalUrl.includes("/trains")) {
    return res.redirect(`/trains?error=${encodedMessage}`);
  }

  if (req.originalUrl.includes("/stations")) {
    return res.redirect(`/stations?error=${encodedMessage}`);
  }

  if (req.originalUrl.includes("/profile")) {
  return res.redirect(`/users/profile?error=${encodedMessage}`);
}


};
