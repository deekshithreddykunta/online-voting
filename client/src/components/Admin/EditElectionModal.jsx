import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditElectionModal({
    election,
    onClose,
    refreshElections
}) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        election_name: election.election_name || "",
        description: election.description || "",
        start_date: election.start_date || "",
        start_time: election.start_time || "",
        end_date: election.end_date || "",
        end_time: election.end_time || "",
        status: election.status || "Upcoming"
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

            const res = await axios.put(
                `http://localhost:5000/api/admin/elections/${election.election_id}`,
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
                err.response?.data?.message || "Failed to update election."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="election-edit-overlay">
            <div className="election-edit-modal">
                <div className="election-edit-header">
                    <h2>Edit Election</h2>
                    <button
                        type="button"
                        className="election-edit-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="election-edit-form">
                    <input
                        type="text"
                        name="election_name"
                        value={form.election_name}
                        onChange={handleChange}
                        placeholder="Election Name"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />

                    <div className="election-edit-grid">
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

                    <div className="election-edit-actions">
                        <button
                            type="button"
                            className="election-edit-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="election-edit-save"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Election"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}