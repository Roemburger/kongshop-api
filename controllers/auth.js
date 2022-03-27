const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const street = req.body.street;
    const number = req.body.number;
    const postalCode = req.body.postalCode;
    const city = req.body.city;
    const region = req.body.region;
    const country = req.body.country;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
            const user = new User({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                street,
                number,
                postalCode,
                city,
                region,
                country,
            });
            return user.save();
        })
        .then((result) => {
            const newToken = generateToken(result.email, result._id.toString());

            res.status(201).json({
                userId: result._id,
                email: result.email,
                message: "User created!",
                firstName: result.firstName,
                lastName: result.lastName,
                street: result.street,
                number: result.number,
                postalCode: result.number,
                city: result.city,
                region: result.region,
                country: result.country,
                _token: newToken,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let currentUser;

    User.findOne({ email: email })
        .populate("email")
        .then((user) => {
            if (!user) {
                const error = new Error("This email has not been registered");
                error.statusCode = 401;
                throw error;
            }
            currentUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error("This password is incorrect.");
                error.statusCode = 401;
                throw error;
            }
            const newToken = generateToken(
                currentUser.email,
                currentUser._id.toString()
            );

            res.status(200).json({
                userId: currentUser._id.toString(),
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                street: currentUser.street,
                number: currentUser.number,
                postalCode: currentUser.postalCode,
                city: currentUser.city,
                region: currentUser.region,
                country: currentUser.country,
                isAdmin: currentUser.isAdmin,
                token: newToken,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

generateToken = (email, userId) => {
    return jwt.sign(
        {
            email: email,
            userId: userId,
        },
        process.env.TOKEN_PRIV
    );
};