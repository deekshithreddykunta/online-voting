const express = require("express");
const router = express.Router();

const {
    authenticateToken,
    isAdmin
} = require("../middleware/authMiddleware");

const {
    getAllCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    toggleCandidateStatus,
    resetCandidatePassword
} = require("../controllers/candidateController");

router.get(
    "/",
    authenticateToken,
    isAdmin,
    getAllCandidates
);

router.post(
    "/",
    authenticateToken,
    isAdmin,
    addCandidate
);

router.put(
    "/:id",
    authenticateToken,
    isAdmin,
    updateCandidate
);

router.delete(
    "/:id",
    authenticateToken,
    isAdmin,
    deleteCandidate
);

router.patch(
    "/:id/status",
    authenticateToken,
    isAdmin,
    toggleCandidateStatus
);

router.put(
    "/:id/reset-password",
    authenticateToken,
    isAdmin,
    resetCandidatePassword
);

module.exports = router;