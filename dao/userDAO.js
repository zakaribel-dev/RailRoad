const User = require('../models/User'); 

class UserDAO {
    static async getUserById(userId) {
        return await User.findById(userId);
    }

    static async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    static async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    static async updateUser(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    static async deleteUser(userId) {
        return await User.findByIdAndDelete(userId);
    }
}

module.exports = UserDAO;
