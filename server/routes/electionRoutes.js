const express = require("express");

const router = express.Router();

const electionController = require("../controllers/electionController");

const {
    authenticateToken,
    isAdmin
} = require("../middleware/authMiddleware");

/* =========================================
   PUBLIC (Logged-in Users)
   View Active Elections
   ========================================= */

router.get(
    "/active",
    authenticateToken,
    electionController.getActiveElections
);

/* =========================================
   ADMIN ONLY
   Get All Elections
   ========================================= */

router.get(
    "/",
    authenticateToken,
    isAdmin,
    electionController.getAllElections
);

/* =========================================
   ADMIN ONLY
   Get Single Election
   ========================================= */

router.get(
    "/:id",
    authenticateToken,
    isAdmin,
    electionController.getElection
);

/* =========================================
   ADMIN ONLY
   Create Election
   ========================================= */

router.post(
    "/",
    authenticateToken,
    isAdmin,
    electionController.addElection
);

/* =========================================
   ADMIN ONLY
   Update Election
   ========================================= */

router.put(
    "/:id",
    authenticateToken,
    isAdmin,
    electionController.updateElection
);

/* =========================================
   ADMIN ONLY
   Delete Election
   ========================================= */

router.delete(
    "/:id",
    authenticateToken,
    isAdmin,
    electionController.deleteElection
);

module.exports = router;