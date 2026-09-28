const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {
    registerValidation,
    loginValidation
} = require("../validations/authValidation");

// Register
router.post(
    "/register",
    registerValidation,
    authController.register
);

// Login
router.post(
    "/login",
    loginValidation,
    authController.login
);

// Forgot Password
router.post(
    "/forgot-password",
    authController.forgotPassword
);


router.post(
    "/verify-otp",
    authController.verifyOTP
);
// Reset Password
router.post(
    "/reset-password",
    authController.resetPassword
);
router.get("/test", (req, res) => {
    res.send("Auth route is working");
});
module.exports = router;