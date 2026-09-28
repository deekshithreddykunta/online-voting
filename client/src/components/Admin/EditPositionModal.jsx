import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditPositionModal({
    position,
    onClose,
    refreshPositions
}) {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        election_id: "",
        position_name: "",
        description: "",
        max_candidates: "",
        eligibility: "",
        status: "Active"
    });

    useEffect(() => {
        if (position) {
            setForm({
                election_id: position.election_id || "",
                position_name: position.position_name || "",
                description: position.description || "",
                max_candidates: position.max_candidates || "",
                eligibility: position.eligibility || "",
                status: position.status || "Active"
            });
        }

        loadElections();
    }, [position]);

    const loadElections = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "https://online-voting-qss7.onrender.com/api/admin/elections",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setElections(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
                `https://online-voting-qss7.onrender.com/api/admin/positions/${position.position_id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            if (refreshPositions) {
                refreshPositions();
            }

            onClose();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Update failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-edit-overlay">
            <div className="position-edit-modal">
                <div className="position-edit-header">
                    <h2>Edit Position</h2>
                    <button
                        type="button"
                        className="position-edit-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="position-edit-form">
                    <select
                        name="election_id"
                        value={form.election_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Election</option>

                        {elections.map((election) => (
                            <option
                                key={election.election_id}
                                value={election.election_id}
                            >
                                {election.election_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="position_name"
                        placeholder="Position Name"
                        value={form.position_name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="max_candidates"
                        placeholder="Maximum Candidates"
                        value={form.max_candidates}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="eligibility"
                        placeholder="Eligibility"
                        value={form.eligibility}
                        onChange={handleChange}
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                    <div className="position-edit-actions">
                        <button
                            type="button"
                            className="position-edit-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="position-edit-save"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Position"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}