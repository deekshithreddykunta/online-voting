import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddCandidateModal({
    onClose,
    refreshCandidates
}) {
    const [elections, setElections] = useState([]);
    const [positions, setPositions] = useState([]);
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        election_id: "",
        position_id: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");

            const [electionRes, positionRes] = await Promise.all([
                axios.get("https://online-voting-qss7.onrender.com/api/admin/elections", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("https://online-voting-qss7.onrender.com/api/admin/positions", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setElections(Array.isArray(electionRes.data) ? electionRes.data : []);
            setPositions(Array.isArray(positionRes.data) ? positionRes.data : []);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load elections or positions.");
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

            const res = await axios.post(
                "https://online-voting-qss7.onrender.com/api/admin/candidates",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(res.data.message);

            if (refreshCandidates) {
                refreshCandidates();
            }

            onClose();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to add candidate."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="candidate-add-overlay">
            <div className="candidate-add-modal">
                <div className="candidate-add-header">
                    <h2>Add Candidate</h2>
                    <button
                        type="button"
                        className="candidate-add-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="candidate-add-form">
                    <div className="candidate-add-grid">
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
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

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

                        <select
                            name="position_id"
                            value={form.position_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Position</option>
                            {positions.map((position) => (
                                <option
                                    key={position.position_id}
                                    value={position.position_id}
                                >
                                    {position.position_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="candidate-add-actions">
                        <button
                            type="button"
                            className="candidate-add-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="candidate-add-save"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Candidate"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}