const UserService = require('../services/userService');

exports.renderRegister = (req, res) => {

    return  res.render('register', { error: null });
};


exports.renderLogin = (req, res) => {

    const error = req.query.message || null;
    return  res.render('login', { error });
};

exports.registerUser = async (req, res) => {
    try {
         await UserService.createUser(req.body);
        
        if (req.headers.accept && req.headers.accept.includes('application/json')) { //postman 
            return res.status(200).json({ message: 'Inscription réussie' });
        }

        res.render('login', { error: null, loggedIn: false }); //front
    } catch (error) {

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(400).json({ message: error.message });
        }
        return  res.status(400).render('register', { error: error.message});
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { user, token } = await UserService.authenticateUser(email, password);
        
        res.cookie('jwt', token, { httpOnly: true, secure: false });

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({ message: 'Connexion réussie', user, token }); 
        }

        return res.redirect('/?message=Connexion%20réussie');
    } catch (error) {

          if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        return res.status(401).render('login', { error: 'Email ou mot de passe incorrect', loggedIn: false });
    }
};



exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // ID de l'utilisateur connecté
        const targetUserId = req.params.id || userId; //  "|| userId" au cas où je consulte mon propre profil

        if (userId !== targetUserId && req.user.role !== 'employee' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès refusé' }); 
        }

        const user = await UserService.getUserById(targetUserId); 
        const loggedIn = req.cookies.jwt ? true : false; 

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({ message: "Voici le profil", user }); 
        }

        return res.render('profile', { user, loggedIn });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error.message);
        return  res.status(500).send('Erreur serveur');
    }
};



exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const targetUserId = req.params.id || userId; //  "|| userId" au cas où je consulte mon propre profil

        const updatedUser = await UserService.updateUser(targetUserId, req.body);
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({message:"profil bien mis à jour ! ", updatedUser});
        }

        return  res.redirect('/?message=Profil bien mis à jour!');


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        let targetUserId = req.params.id || userId; 

      
        if (targetUserId === 'me') {
            targetUserId = userId;
        }

        await UserService.deleteUser(targetUserId);
        return res.status(200).json({ message: 'Compte bien supprimé' });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
