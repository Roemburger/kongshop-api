const User = require("../models/user");

module.exports = async (req, res, next) => {
    const userId = req.userId;
    try {
        await User.findById(userId).then((user) => {
            if (!user) {
                const error = new Error("Has not been authenticated");
                error.statusCode = 401;
                throw error;
            }
            req.isAdmin = user.isAdmin;
        });
        next();
    } catch (error) {
        next(error);
    }
};