const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

// Dashboard Statistics
router.get(
  "/dashboard",
  authenticateToken,
  getDashboard
);

module.exports = router;