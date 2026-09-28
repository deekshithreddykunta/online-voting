console.log("Result Routes Loaded");

const express = require("express");

const router = express.Router();

const resultController = require("../controllers/resultController");

console.log("Result Controller =", resultController);
const {

    authenticateToken,

    isAdmin

} = require("../middleware/authMiddleware");

/* ==========================================
   ADMIN ROUTES
========================================== */

// Get all results
router.get(
    "/",
    authenticateToken,
    isAdmin,
    resultController.getResults
);

// Get winners
router.get(
    "/winners",
    authenticateToken,
    isAdmin,
    resultController.getWinners
);

/* ==========================================
   VOTER ROUTE
========================================== */

router.get(
    "/voter",
    authenticateToken,
    resultController.getVoterResults
);

module.exports = router;