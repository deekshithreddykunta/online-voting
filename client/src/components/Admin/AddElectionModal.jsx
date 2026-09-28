import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddElectionModal({ onClose, refreshElections }) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        election_name: "",
        description: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        status: "Upcoming"
    });

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

            const res = await axios.post(
                "https://online-voting-qss7.onrender.com/api/admin/elections",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            if (refreshElections) {
                refreshElections();
            }

            onClose();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to create election."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="election-add-overlay">
            <div className="election-add-modal">
                <div className="election-add-header">
                    <h2>Create Election</h2>
                    <button
                        type="button"
                        className="election-add-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="election-add-form">
                    <input
                        type="text"
                        name="election_name"
                        placeholder="Election Name"
                        value={form.election_name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <div className="election-add-grid">
                        <input
                            type="date"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="time"
                            name="start_time"
                            value={form.start_time}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="end_date"
                            value={form.end_date}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="time"
                            name="end_time"
                            value={form.end_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <div className="election-add-actions">
                        <button
                            type="button"
                            className="election-add-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="election-add-save"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Election"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}