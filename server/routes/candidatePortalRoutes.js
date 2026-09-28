const express = require("express");
const router = express.Router();

const candidatePortalController = require("../controllers/candidatePortalController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

// ======================================
// Candidate Dashboard
// ======================================

router.get(
    "/dashboard",
    authenticateToken,
    candidatePortalController.getDashboard
);

// ======================================
// Candidate Profile
// ======================================

router.get(
    "/profile",
    authenticateToken,
    candidatePortalController.getProfile
);

// ======================================
// Available Elections
// ======================================

router.get(
    "/elections",
    authenticateToken,
    candidatePortalController.getAvailableElections
);

// ======================================
// Positions of Selected Election
// ======================================

router.get(
    "/elections/:id/positions",
    authenticateToken,
    candidatePortalController.getPositions
);

// ======================================
// Apply For Election
// ======================================

router.post(
    "/applications",
    authenticateToken,
    candidatePortalController.applyElection
);

// ======================================
// My Nominations
// ======================================

router.get(
    "/nominations",
    authenticateToken,
    candidatePortalController.getMyNominations
);
// ======================================
// Update Profile
// ======================================

router.put(
    "/profile",
    authenticateToken,
    candidatePortalController.updateProfile
);

// ======================================
// Change Password
// ======================================

router.put(
    "/change-password",
    authenticateToken,
    candidatePortalController.changePassword
);
/* ======================================
   Candidate Results
====================================== */

router.get(

    "/results",

    authenticateToken,

    candidatePortalController.getResults

);
/* ======================================
   Submit Nomination
====================================== */

router.post(
    "/submit-nomination",
    authenticateToken,
    candidatePortalController.submitNomination
);
router.get(
    "/check-nomination",
    authenticateToken,
    candidatePortalController.checkExistingNomination
);
module.exports = router;