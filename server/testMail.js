require("dotenv").config();

const { sendOTP } = require("./services/emailService");

sendOTP(
    "deekshithreddykunta02@gmail.com",
    "482913"
)
.then(() => {
    console.log("Email Sent Successfully");
})
.catch((err) => {
    console.log(err);
});