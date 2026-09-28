const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded JWT:", decoded);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

exports.isAdmin = (req, res, next) => {

    if (req.user.role_id !== 1) {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();

};
exports.isOfficer = (req, res, next) => {

    if (req.user.role_id !== 2) {

        return res.status(403).json({
            message: "Election Officer Access Only"
        });

    }

    next();

};