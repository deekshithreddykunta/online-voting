
const bcrypt = require("bcryptjs");
const generateVoterId = require("../utils/generateVoterId");
const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const generateOTP = require("../utils/generateOTP");
const { sendOTP } = require("../services/emailService");
const pool = require("../config/db");
exports.register = async (req, res) => {

    try {

        const {
            role,
            full_name,
            username,
            email,
            phone,
            password
        } = req.body;

        let role_id;

        switch (role) {

            case "Admin":
                role_id = 1;
                break;

            case "Election Officer":
                role_id = 2;
                break;

            case "Candidate":
                role_id = 3;
                break;

            case "Voter":
            default:
                role_id = 4;
                break;
        }

        // Check Email
        const emailExists = await userModel.findUserByEmail(email);

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check Username
        const usernameExists = await userModel.findUserByUsername(username);

        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        // Check Phone
        const phoneExists = await userModel.findUserByPhone(phone);

        if (phoneExists) {
            return res.status(400).json({
                success: false,
                message: "Phone number already exists"
            });
        }

        const voter_id = await generateVoterId();

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await userModel.createUser({
            role_id,
            full_name,
            username,
            email,
            phone,
            password: hashedPassword,
            voter_id
        });

        // ==========================
        // Create Candidate Record
        // ==========================
        if (role_id === 3) {

            await pool.query(
                `
                INSERT INTO candidates
                (
                    user_id,
                    status
                )
                VALUES
                (
                    $1,
                    'Approved'
                )
                `,
                [user.user_id]
            );

        }

        // ==========================
        // Create Voter Record
        // ==========================
        if (role_id === 4) {

            await pool.query(
                `
                INSERT INTO voters
                (
                    user_id,
                    voter_id
                )
                VALUES
                (
                    $1,
                    $2
                )
                `,
                [
                    user.user_id,
                    voter_id
                ]
            );

        }

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const { generateToken } = require("../services/jwtService");

exports.login = async (req, res) => {
    try {

        const { login, password } = req.body;
        const user = await userModel.findUserByEmailOrUsername(login);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or email"
            });
        }
if (!user.is_active) {
    return res.status(403).json({
        message: "Your account has been deactivated. Contact the administrator."
    });
}
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                username: user.username,
                email: user.email,
                role_id: user.role_id
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not registered"
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // Expire after 5 minutes
        const expires_at = new Date(Date.now() + 5 * 60 * 1000);

        // Save OTP
        await otpModel.saveOTP(
            email,
            otp,
            expires_at
        );

        // Send Email
        await sendOTP(email, otp);

        res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
exports.verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const storedOTP = await otpModel.getOTP(email);

        if (!storedOTP) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        // Check expiry
        if (new Date() > new Date(storedOTP.expires_at)) {

            await otpModel.deleteOTP(email);

            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });

        }

        // Check OTP
        if (storedOTP.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

        }

        await otpModel.verifyOTP(email);

res.json({
    success: true,
    message: "OTP verified successfully"
});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
exports.resetPassword = async (req, res) => {
    try {

        const { email, password } = req.body;

        const otpRecord = await otpModel.getOTP(email);

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP verification required"
            });
        }

        if (!otpRecord.is_verified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your OTP first"
            });
        }

        // Find user by email
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update using user_id
        await userModel.updatePassword(
            user.user_id,
            hashedPassword
        );

        await otpModel.deleteOTP(email);

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
