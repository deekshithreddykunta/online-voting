const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            role_id: user.role_id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};