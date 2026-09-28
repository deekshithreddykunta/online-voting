const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    family: 4, // Force IPv4

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

transporter.verify(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("SMTP Ready");
    }
});

const sendOTP = async (email, otp) => {

    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "SecureVote Password Reset OTP",
        html: `
            <h2>SecureVote</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
        `
    });

};

module.exports = { sendOTP };