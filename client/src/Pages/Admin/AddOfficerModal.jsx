import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddOfficerModal({ close, refresh }) {
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        employee_id: "",
        department: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const saveOfficer = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                "https://online-voting-qss7.onrender.com/api/admin/officers",
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Officer added successfully!");

            if (refresh) {
                refresh();
            }

            close();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="officers-add-overlay">
            <div className="officers-add-modal">
                <div className="officers-add-header">
                    <h2>Add Election Officer</h2>
                    <button
                        type="button"
                        className="officers-add-close"
                        onClick={close}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={saveOfficer} className="officers-add-form">
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

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="employee_id"
                        placeholder="Employee ID"
                        value={form.employee_id}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={form.department}
                        onChange={handleChange}
                    />

                    <div className="officers-add-actions">
                        <button
                            type="button"
                            className="officers-add-cancel"
                            onClick={close}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="officers-add-save"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}