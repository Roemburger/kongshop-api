const express = require("express");
const { body } = require("express-validator");

const userModel = require("../models/user");
const controller = require("../controllers/auth");
const router = express.Router();

router.post(
    "/signup",
    [
        body("email").isEmail()
            .custom((value, { req }) => {
                return userModel.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) return Promise.reject("This email is already registered.");
                });
            }).normalizeEmail(),
        body("password").trim().not().isEmpty(),
        body("firstName").trim().not().isEmpty(),
        body("lastName").trim().not().isEmpty(),
    ],
    controller.signup
);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .normalizeEmail(),
    ],
    controller.login
);

module.exports = router;