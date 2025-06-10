const UserService = require("../services/userService");
const { ERRORS } = require("../utils/errors");

class UserController {
  static renderRegister(req, res) {
  const error = req.query.message || null;
  return res.render("register", { error });

}

  static renderLogin(req, res) {
    const error = req.query.message || null;
    return res.render("login", { error });
  }

  static async registerUser(req, res, next) {
    try {
      await UserService.createUser(req.body);

      if (req.headers.accept.includes("application/json")) {
        // postman
        return res.status(200).json({ message: "Inscription réussie" });
      }
          const error = req.query.error || null;

      res.render("login", { error, loggedIn: false }); // front
    } catch (error) {
      return next(error);
    }
  }

static async loginUser(req, res, next) {
  const { email, password } = req.body;
  try {
    const { user, token } = await UserService.authenticateUser(email, password);

    res.cookie("jwt", token, { httpOnly: true, secure: false });

    if (req.headers.accept.includes("application/json")) {
      return res.status(200).json({ message: "Connexion réussie", user, token });
    }

    return res.redirect("/?message=Connexion%20réussie");
  } catch (error) {
    if (req.headers.accept.includes("application/json")) {
      return next(error); // Pour les requêtes API, passe l'erreur au middleware
    }
    return res.render("login", { error: error.message, loggedIn: false });
  }
}

  static async getUserProfile(req, res, next) {
    try {
      const userId = req.user.id; // ID de l'utilisateur connecté
      const targetUserId = req.params.id || userId; // "|| userId" au cas où je consulte mon propre profil
      const error = req.query.message || null;

      if (
        userId !== targetUserId &&
        req.user.role !== "employee" &&
        req.user.role !== "admin"
      ) {
        return next(ERRORS.ACCESS_DENIED);
      }

      const user = await UserService.getUserById(targetUserId);
      const loggedIn = req.cookies.jwt ? true : false;

      if (req.headers.accept.includes("application/json")) {
        return res.status(200).json({ message: "Voici le profil", user });
      }

      return res.render("profile", { user, loggedIn, error });
    } catch (error) {
      return next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const targetUserId = req.params.id || userId; // "|| userId" au cas où jupdate mon propre profil

      const updatedUser = await UserService.updateUser(targetUserId, req.body);
      if (req.headers.accept.includes("application/json")) {
        return res
          .status(200)
          .json({ message: "profil bien mis à jour !", updatedUser });
      }

      return res.redirect("/?message=Profil bien mis à jour!");
    } catch (error) {
      return next(error); 
    }
  }

  static async deleteProfile(req, res, next) {
    try {
      const userId = req.user.id;
      let targetUserId = req.params.id || userId;

      if (targetUserId === "me") {
        targetUserId = userId;
      }

      await UserService.deleteUser(targetUserId);

      if (req.headers.accept.includes("application/json")) {
        return res.status(200).json({ message: "Compte bien supprimé" });
      }

      return res.redirect("/?message=Compte bien supprimé");
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserController;
