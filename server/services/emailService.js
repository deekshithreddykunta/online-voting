const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendOTP = async (email, otp) => {
    try {
        await apiInstance.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: "SecureVote",
            },
            to: [
                {
                    email: email,
                },
            ],
            subject: "SecureVote Password Reset OTP",
            htmlContent: `
                <div style="font-family: Arial; padding:20px">
                    <h2>SecureVote</h2>
                    <p>Your OTP is:</p>
                    <h1 style="color:#2563eb">${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                </div>
            `,
        });

        console.log("✅ OTP email sent");
    } catch (err) {
        console.error(err.response?.body || err);
        throw err;
    }
};

module.exports = { sendOTP };