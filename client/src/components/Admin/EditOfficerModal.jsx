import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditOfficerModal({
    officer,
    close,
    refresh,
}) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [department, setDepartment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (officer) {
            setFullName(officer.full_name || "");
            setUsername(officer.username || "");
            setEmail(officer.email || "");
            setPhone(officer.phone || "");
            setEmployeeId(officer.employee_id || "");
            setDepartment(officer.department || "");
        }
    }, [officer]);

    const updateOfficer = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.put(
                `https://online-voting-qss7.onrender.com/api/admin/officers/${officer.user_id}`,
                {
                    full_name: fullName,
                    username,
                    email,
                    phone,
                    employee_id: employeeId,
                    department,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message || "Officer updated successfully!");

            if (refresh) {
                refresh();
            }

            close();
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!officer) return null;

    return (
        <div className="officers-edit-overlay">
            <div className="officers-edit-modal">
                <div className="officers-edit-header">
                    <h2>Edit Election Officer</h2>
                    <button
                        type="button"
                        className="officers-edit-close"
                        onClick={close}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={updateOfficer} className="officers-edit-form">
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        required
                    />

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                    />

                    <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="Employee ID"
                    />

                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Department"
                    />

                    <div className="officers-edit-actions">
                        <button
                            type="button"
                            className="officers-edit-cancel"
                            onClick={close}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="officers-edit-save"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}