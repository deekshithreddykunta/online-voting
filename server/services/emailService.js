const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "SecureVote Password Reset OTP",
        html: `
            <div style="font-family:Arial;padding:20px">
                <h2>SecureVote</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
            </div>
        `,
    });
};

module.exports = { sendOTP };