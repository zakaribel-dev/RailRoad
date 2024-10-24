const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserDAO = require('../dao/userDAO');

class UserService {

static async getUserById(userId) {
    const user = await UserDAO.getUserById(userId);
    if (!user) {
        throw new Error('Utilisateur introuvable');
    }
    return user;
}

    static async createUser(userData) {
        const { email, pseudo, password, role } = userData;

        const existingUser = await UserDAO.getUserByEmail(email);
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserDAO.createUser({
            email,
            pseudo,
            password: hashedPassword,
            role
        });

        return newUser;
    }


    static async authenticateUser(email, password) {
        const user = await UserDAO.getUserByEmail(email);
        if (!user) {
            throw new Error('Utilisateur introuvable');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Mot de passe incorrect');
        }

        const token = jwt.sign({ id: user._id, role: user.role, username: user.pseudo }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return { user, token };
    }

    static async updateUser(userId, updateData) {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        return await UserDAO.updateUser(userId, updateData);
    }

    static async deleteUser(userId) {
        return await UserDAO.deleteUser(userId);
    }
}

module.exports = UserService;
