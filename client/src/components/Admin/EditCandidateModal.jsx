import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditCandidateModal({
    candidate,
    close,
    refresh
}) {
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (candidate) {
            setForm({
                full_name: candidate.full_name || "",
                username: candidate.username || "",
                email: candidate.email || "",
                phone: candidate.phone || ""
            });
        }
    }, [candidate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.put(
                `https://online-voting-qss7.onrender.com/api/admin/candidates/${candidate.user_id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            if (refresh) {
                refresh();
            }

            close();
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="candidate-edit-overlay">
            <div className="candidate-edit-modal">
                <div className="candidate-edit-header">
                    <h2>Edit Candidate</h2>
                    <button
                        type="button"
                        className="candidate-edit-close"
                        onClick={close}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="candidate-edit-form">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <div className="candidate-edit-actions">
                        <button
                            type="button"
                            className="candidate-edit-cancel"
                            onClick={close}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="candidate-edit-save"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Candidate"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}