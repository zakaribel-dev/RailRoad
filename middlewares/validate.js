const validationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = encodeURIComponent(error.details[0].message);

    // check si front
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      const referer = req.get("referer"); // referer = route dans laquelle s'estproduite l'erreur de validation 
      return res.redirect(`${referer}?error=${errorMessage}`);
    }

    // postman etc..
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = validationMiddleware;
