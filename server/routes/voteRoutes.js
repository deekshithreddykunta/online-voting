console.log("✅ voteRoutes loaded");

const express = require("express");
const router = express.Router();

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    getBallot,
    castVote,
    getVotingStatus,
    getMyVotes
} = require("../controllers/voteController");

// ==========================
// TEST ROUTE
// ==========================
router.get("/test", (req, res) => {
    console.log("✅ Test Route Hit");
    res.json({
        success: true,
        message: "Vote Routes Working"
    });
});

// ==========================
// GET BALLOT
// ==========================
router.get(
    "/ballot",
    authenticateToken,
    getBallot
);

// ==========================
// GET VOTING STATUS
// ==========================
router.get(
    "/status",
    authenticateToken,
    getVotingStatus
);

// ==========================
// GET MY VOTES
// ==========================
router.get(
    "/my-votes",
    (req, res, next) => {
        console.log("✅ Route reached before authentication");
        next();
    },
    authenticateToken,
    (req, res, next) => {
        console.log("✅ Authentication passed");
        console.log(req.user);
        next();
    },
    getMyVotes
);

// ==========================
// CAST VOTE
// ==========================
router.post(
    "/",
    authenticateToken,
    castVote
);

module.exports = router;