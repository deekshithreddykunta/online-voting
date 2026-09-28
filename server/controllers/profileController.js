console.log("PROFILE CONTROLLER LOADED");
const pool = require("../config/db");
const fs = require("fs");
// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const result = await pool.query(
            `
            SELECT
                user_id,
                full_name,
                username,
                email,
                phone,
                voter_id,
                created_at
            FROM users
            WHERE user_id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
exports.updateProfilePicture = async (req, res) => {

    try {

        const userId = req.user.user_id;

        if (!req.file) {
            return res.status(400).json({
                message: "No image selected"
            });
        }

        await pool.query(
            `
            UPDATE users
            SET profile_photo=$1
            WHERE user_id=$2
            `,
            [
                req.file.filename,
                userId
            ]
        );

        res.json({
            message: "Profile picture updated successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            full_name,
            email,
            phone
        } = req.body;

        const result = await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                email = $2,
                phone = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $4
            RETURNING *
            `,
            [
                full_name,
                email,
                phone,
                userId
            ]
        );

        res.json({
            message: "Profile Updated Successfully",
            user: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const bcrypt = require("bcryptjs");

// ===============================
// CHANGE PASSWORD
// ===============================
exports.changePassword = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await pool.query(
            `
            SELECT password
            FROM users
            WHERE user_id=$1
            `,
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const validPassword = await bcrypt.compare(
            currentPassword,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await pool.query(
            `
            UPDATE users
            SET password=$1
            WHERE user_id=$2
            `,
            [
                hashedPassword,
                userId
            ]
        );

        res.json({
            message: "Password changed successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
