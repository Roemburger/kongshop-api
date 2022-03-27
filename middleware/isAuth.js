const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.get("Authorization");
    if (!header) {
        const error = new Error("Has not been authenticated");
        error.statusCode = 401;
        throw error;
    }
    const token = header.split(" ")[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.TOKEN_PRIV);
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
    if (!decoded) {
        const error = new Error("Has not been authenticated");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decoded.userId;
    next();
};