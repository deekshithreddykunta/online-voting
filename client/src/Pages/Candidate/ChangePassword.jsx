import { useState } from "react";
import { toast } from "react-toastify";
import { changeCandidatePassword } from "../../services/candidateService";
import "./ChangePassword.css";

export default function ChangePassword() {

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {

            toast.error("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            const res = await changeCandidatePassword({

                currentPassword: form.currentPassword,

                newPassword: form.newPassword

            });

            toast.success(res.data.message);

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Unable to change password."

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="change-password">

            <h1>Change Password</h1>

            <div className="password-card">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <label>Current Password</label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="row">

                        <label>New Password</label>

                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="row">

                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        className="save-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Change Password"}
                    </button>

                </form>

            </div>

        </div>

    );

}