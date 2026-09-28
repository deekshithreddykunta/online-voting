import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    forgotPassword,
    verifyOTP,
    resetPassword,
} from "../../services/authService";
import "./ForgotPassword.css";

export default function ForgotPassword() {
const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // SEND OTP
    const sendOtp = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await forgotPassword({ email });

            setMessage(res.data.message);

            setStep(2);

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                "Failed to send OTP"
            );

        }

        setLoading(false);

    };

    // VERIFY OTP
    const checkOtp = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await verifyOTP({
                email,
                otp,
            });

            setMessage(res.data.message);

            setStep(3);

        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                "Invalid OTP"
            );

        }

        setLoading(false);

    };

    // RESET PASSWORD
    const changePassword = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await resetPassword({
                email,
                password,
            });
setMessage("Password Changed Successfully");

setStep(4);

// Redirect after 2 seconds
setTimeout(() => {
    navigate("/login");
}, 2000);
        } catch (err) {

            setMessage(
                err.response?.data?.message ||
                "Failed to reset password"
            );

        }

        setLoading(false);

    };

    return (
    <div className="login-page">

        {/* LEFT SIDE */}

        <div className="login-left">

            <h1>SecureVote</h1>

            <h2>Forgot Password</h2>

            <p>
                Recover your account securely using email verification.
            </p>

            <ul>
                <li>✓ End-to-End Encryption</li>
                <li>✓ Blockchain Security</li>
                <li>✓ Transparent Elections</li>
                <li>✓ Instant Result Verification</li>
            </ul>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-right">

            <div className="forgot-card">

                <h2>Forgot Password</h2>

                <div className="progress">

                    <div className={`step ${step >= 1 ? "done" : ""}`}>
                        {step > 1 ? "✓" : "1"}
                    </div>

                    <div className={`step ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
                        {step > 2 ? "✓" : "2"}
                    </div>

                    <div className={`step ${step === 3 ? "active" : step === 4 ? "done" : ""}`}>
                        {step === 4 ? "✓" : "3"}
                    </div>

                </div>

                {/* STEP 1 */}

                {step === 1 && (
                    <>
                        <p>Enter your registered email</p>

                        <form onSubmit={sendOtp}>

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button>
                                {loading ? "Sending..." : "Send OTP"}
                            </button>

                        </form>
                    </>
                )}

                {/* STEP 2 */}

                {step === 2 && (
                    <>
                        <p>Enter OTP sent to your email</p>

                        <form onSubmit={checkOtp}>

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />

                            <button>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                        </form>
                    </>
                )}

                {/* STEP 3 */}

                {step === 3 && (
                    <>
                        <p>Create a new password</p>

                        <form onSubmit={changePassword}>

                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button>
                                {loading ? "Saving..." : "Change Password"}
                            </button>

                        </form>
                    </>
                )}

                {/* STEP 4 */}

                {step === 4 && (
                    <div className="success">
                        <h3>✅ Password Changed Successfully</h3>
                        <p>Redirecting to Login...</p>
                    </div>
                )}

                {message && <p className="msg">{message}</p>}

            </div>

        </div>

    </div>
);
}     