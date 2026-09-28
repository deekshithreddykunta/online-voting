import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetCandidatePasswordModal({
    candidate,
    onClose
}) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.put(
                `http://localhost:5000/api/admin/candidates/${candidate.user_id}/reset-password`,
                { password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message);
            onClose();
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="candidate-reset-overlay">
            <div className="candidate-reset-modal">
                <div className="candidate-reset-header">
                    <h2>Reset Candidate Password</h2>
                    <button
                        type="button"
                        className="candidate-reset-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <p className="candidate-reset-name">
                    <strong>{candidate.full_name}</strong>
                </p>

                <form onSubmit={handleSubmit} className="candidate-reset-form">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <div className="candidate-reset-actions">
                        <button
                            type="button"
                            className="candidate-reset-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="candidate-reset-save"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}