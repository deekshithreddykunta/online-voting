

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});

transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP Verify Error:", err);
    } else {
        console.log("SMTP Ready");
    }
});

const sendOTP = async (email, otp) => {

    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject: "SecureVote Password Reset OTP",

        html: `
            <div style="font-family:Arial;padding:20px">
                <h2>SecureVote</h2>

                <p>Your One-Time Password is:</p>

                <h1 style="color:#2563eb">${otp}</h1>

                <p>This OTP is valid for <b>5 minutes</b>.</p>

                <p>Please do not share this OTP with anyone.</p>

                <br>

                <p>SecureVote Team</p>
            </div>
        `

    });

};

module.exports = {
    sendOTP
};