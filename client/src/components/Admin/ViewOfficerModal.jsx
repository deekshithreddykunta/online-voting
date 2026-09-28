export default function ViewOfficerModal({ officer, close }) {
    if (!officer) return null;

    return (
        <div className="officers-view-overlay">
            <div className="officers-view-modal">
                <div className="officers-view-header">
                    <h2>Officer Details</h2>
                    <button
                        type="button"
                        className="officers-view-close"
                        onClick={close}
                    >
                        ×
                    </button>
                </div>

                <div className="officers-view-details">
                    <div className="officers-view-row">
                        <strong>User ID</strong>
                        <span>{officer.user_id}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Full Name</strong>
                        <span>{officer.full_name}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Username</strong>
                        <span>{officer.username}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Email</strong>
                        <span>{officer.email}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Phone</strong>
                        <span>{officer.phone || "N/A"}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Employee ID</strong>
                        <span>{officer.employee_id || "N/A"}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Department</strong>
                        <span>{officer.department || "N/A"}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Status</strong>
                        <span>{officer.status || (officer.is_active ? "Active" : "Inactive")}</span>
                    </div>

                    <div className="officers-view-row">
                        <strong>Registered</strong>
                        <span>
                            {officer.created_at
                                ? new Date(officer.created_at).toLocaleDateString()
                                : "N/A"}
                        </span>
                    </div>
                </div>

                <div className="officers-view-actions">
                    <button
                        type="button"
                        className="officers-view-close-btn"
                        onClick={close}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}