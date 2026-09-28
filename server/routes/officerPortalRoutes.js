const express = require("express");
const router = express.Router();

const officerPortalController = require("../controllers/officerPortalController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");
console.log("officerPortalController =", officerPortalController);

console.log("authenticateToken =", authenticateToken);
console.log(Object.keys(officerPortalController));
router.get(
    "/dashboard",
    authenticateToken,
    officerPortalController.getDashboard
);

router.get(
    "/profile",
    authenticateToken,
    officerPortalController.getProfile
);

router.put(
    "/profile",
    authenticateToken,
    officerPortalController.updateProfile
);

router.put(
    "/change-password",
    authenticateToken,
    officerPortalController.changePassword
);
router.get(
    "/elections",
    authenticateToken,
    officerPortalController.getElections
);
router.post(

    "/elections",

    authenticateToken,

    officerPortalController.createElection

);
router.put(
    "/elections/:id/activate",
    authenticateToken,
    officerPortalController.activateElection
);

router.put(
    "/elections/:id/close",
    authenticateToken,
    officerPortalController.closeElection
);
router.get(

    "/elections/:id",

    authenticateToken,

    officerPortalController.getElectionById

);
router.put(

    "/elections/:id",

    authenticateToken,

    officerPortalController.updateElection

);
router.delete(
    "/elections/:id",
    authenticateToken,
    officerPortalController.deleteElection
);
router.get(
    "/applications",
    authenticateToken,
    officerPortalController.getApplications
);


router.get(
    "/applications/:id",
    authenticateToken,
    officerPortalController.getApplicationById
);

router.put(
    "/applications/:id/approve",
    authenticateToken,
    officerPortalController.approveApplication
);

router.put(
    "/applications/:id/reject",
    authenticateToken,
    officerPortalController.rejectApplication
);

router.put("/applications/:id/symbol", authenticateToken, officerPortalController.assignSymbol);
router.get(
    "/positions",
    authenticateToken,
    officerPortalController.getPositions
);

router.get(
    "/positions/:id",
    authenticateToken,
    officerPortalController.getPositionById
);

router.post(
    "/positions",
    authenticateToken,
    officerPortalController.createPosition
);

router.put(
    "/positions/:id",
    authenticateToken,
    officerPortalController.updatePosition
);

router.delete(
    "/positions/:id",
    authenticateToken,
    officerPortalController.deletePosition
);
router.get(
    "/voters",
    authenticateToken,
    officerPortalController.getVoters
);
router.get(
    "/voters/:id",
    authenticateToken,
    officerPortalController.getVoterById
);
router.put(
    "/voters/:id/verify",
    authenticateToken,
    officerPortalController.verifyVoter
);
router.put(
    "/voters/:id/verify",
    authenticateToken,
    officerPortalController.verifyVoter
);
router.get(
    "/voters/:id/voting-status",
    authenticateToken,
    officerPortalController.getVotingStatus
);
router.get(
    "/results",
    authenticateToken,
    officerPortalController.getResults
);
router.post(
    "/results/generate",
    authenticateToken,
    officerPortalController.generateResults
);
router.get(
    "/results/election/:election_id",
    authenticateToken,
    officerPortalController.getResultByElection
);
router.post(
    "/results/publish",
    authenticateToken,
    officerPortalController.publishResults
);
router.get(
    "/live-voting",
    authenticateToken,
    officerPortalController.getLiveVoting
);
module.exports = router;
