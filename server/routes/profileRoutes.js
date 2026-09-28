const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword
    
} = require("../controllers/profileController");

// ====================================
// GET PROFILE
// ====================================
router.get(
    "/profile",
    authenticateToken,
    getProfile
);

// ====================================
// UPDATE PROFILE
// ====================================
router.put(
    "/profile",
    authenticateToken,
    updateProfile
);

// ====================================
// CHANGE PASSWORD
// ====================================
router.put(
    "/change-password",
    authenticateToken,
    changePassword
);



module.exports = router;