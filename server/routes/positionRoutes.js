const express = require("express");

const router = express.Router();

const {
    authenticateToken,
    isAdmin
} = require("../middleware/authMiddleware");

const {
    getAllPositions,
    getPosition,
    addPosition,
    updatePosition,
    deletePosition
} = require("../controllers/positionController");

router.get(
    "/",
    authenticateToken,
    isAdmin,
    getAllPositions
);

router.get(
    "/:id",
    authenticateToken,
    isAdmin,
    getPosition
);

router.post(
    "/",
    authenticateToken,
    isAdmin,
    addPosition
);

router.put(
    "/:id",
    authenticateToken,
    isAdmin,
    updatePosition
);

router.delete(
    "/:id",
    authenticateToken,
    isAdmin,
    deletePosition
);

module.exports = router;