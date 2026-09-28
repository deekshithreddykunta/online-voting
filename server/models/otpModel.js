const pool = require("../config/db");

// Save OTP
const saveOTP = async (email, otp, expires_at) => {

    // Delete old OTP if it exists
    await pool.query(
        "DELETE FROM password_reset_otp WHERE email=$1",
        [email]
    );

    // Save new OTP
    await pool.query(
        `INSERT INTO password_reset_otp
        (email, otp, expires_at)
        VALUES ($1, $2, $3)`,
        [email, otp, expires_at]
    );
};

// Get OTP
const getOTP = async (email) => {

    const result = await pool.query(
        "SELECT * FROM password_reset_otp WHERE email=$1",
        [email]
    );

    return result.rows[0];
};

// Delete OTP
const deleteOTP = async (email) => {

    await pool.query(
        "DELETE FROM password_reset_otp WHERE email=$1",
        [email]
    );
};
const verifyOTP = async (email) => {

    await pool.query(

        `UPDATE password_reset_otp
         SET is_verified = TRUE
         WHERE email = $1`,

        [email]

    );

};

module.exports = {
    saveOTP,
    getOTP,
    deleteOTP,
    verifyOTP
};