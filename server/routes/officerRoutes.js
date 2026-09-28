const express = require("express");
const router = express.Router();
const {
    getAllOfficers,
    addOfficer,
    updateOfficer,
    deleteOfficer,
    toggleOfficerStatus
} = require("../controllers/officerController");
const officerController = require("../controllers/officerController");

const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", officerController.getAllOfficers);

router.post("/", officerController.addOfficer);

router.put(
    "/:id",
    authenticateToken,
    officerController.updateOfficer
);
router.delete(
    "/:id",
    authenticateToken,
    officerController.deleteOfficer
);
router.patch(
    "/:id/status",
    authenticateToken,
    officerController.toggleOfficerStatus
);

module.exports = router;
