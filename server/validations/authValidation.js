const { body } = require("express-validator");

exports.registerValidation = [

    body("full_name")
        .notEmpty()
        .withMessage("Full Name is required"),

    body("username")
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters"),

    body("email")
        .isEmail()
        .withMessage("Invalid Email"),

    body("phone")
        .isLength({ min: 10 })
        .withMessage("Invalid Phone"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .notEmpty()
        .withMessage("Role required")

];
exports.loginValidation = [

    body("login")
        .notEmpty()
        .withMessage("Username or Email required"),

    body("password")
        .notEmpty()
        .withMessage("Password required")

];