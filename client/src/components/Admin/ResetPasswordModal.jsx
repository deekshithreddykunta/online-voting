import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddVoterModal.css";

export default function ResetPasswordModal({
    show,
    voter,
    onClose
}) {

    if (!show || !voter) return null;

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const resetPassword = async () => {

        if (!password.trim()) {
            toast.error("Please enter a new password.");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const res = await axios.put(
                `http://localhost:5000/api/admin/voters/${voter.user_id}/reset-password`,
                { password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            onClose();

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Password reset failed"
            );

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal-box">

                <h2>🔒Reset Password</h2>

   
   

    <div className="reset-info-text">
        <div className="reset-info-box">
    <div className="reset-info-icon">
        <i className="fas fa-info-circle"></i>
    </div>

    <div className="reset-info-content">
        <h4>Set a new password for the selected voter.</h4>
        <p>
            The new password will replace the old password.
        </p>
    </div>
</div>
    </div>

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="reset-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "10px"
                    }}
                >
                    <div className="show-password-row">
    <label className="checkbox-label">
        <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
        />
        <span>Show Password</span>
    </label>
</div>
                    Show Password
                </label>

                <div className="modal-buttons">

                    <button onClick={resetPassword}>
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    );

}