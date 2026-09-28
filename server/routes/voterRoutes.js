console.log("✅ voterRoutes loaded");

const express = require("express");
const router = express.Router();
const { authenticateToken,
    isAdmin } = require("../middleware/authMiddleware");
const {
    getAllVoters,
    addVoter,
    updateVoter,
    deleteVoter,
    toggleVoterStatus,
    exportVoters,
    resetVoterPassword
} = require("../controllers/voterController");

router.get("/", getAllVoters);
router.get(
    "/export/csv",
    authenticateToken,
    isAdmin,
    exportVoters
);

router.post("/", addVoter);
router.put("/:id", updateVoter);
router.delete("/:id", deleteVoter);
router.patch(
    "/:id/status",
    authenticateToken,
    isAdmin,
    toggleVoterStatus
);
router.put(
    "/:id/reset-password",
    authenticateToken,
    isAdmin,
    resetVoterPassword
);
module.exports = router;
