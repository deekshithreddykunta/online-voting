export default function ViewCandidateModal({
    candidate,
    close
}) {
    if (!candidate) return null;

    return (
        <div className="candidate-view-overlay">
            <div className="candidate-view-modal">
                <div className="candidate-view-header">
                    <h2>Candidate Details</h2>
                    <button
                        type="button"
                        className="candidate-view-close"
                        onClick={close}
                    >
                        ×
                    </button>
                </div>

                <div className="candidate-view-details">
                    <div className="candidate-view-row">
                        <strong>Candidate ID</strong>
                        <span>{candidate.user_id}</span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Full Name</strong>
                        <span>{candidate.full_name}</span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Username</strong>
                        <span>{candidate.username}</span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Email</strong>
                        <span>{candidate.email}</span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Phone</strong>
                        <span>{candidate.phone || "Not Available"}</span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Voter ID</strong>
                        <span>{candidate.voter_id || "Not Available"}</span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Status</strong>
                        <span
                            className={
                                candidate.status === "Active"
                                    ? "status-active"
                                    : "status-inactive"
                            }
                        >
                            {candidate.status}
                        </span>
                    </div>

                    <div className="candidate-view-row">
                        <strong>Registered</strong>
                        <span>
                            {candidate.created_at
                                ? new Date(candidate.created_at).toLocaleDateString()
                                : "N/A"}
                        </span>
                    </div>
                </div>

                <div className="candidate-view-actions">
                    <button
                        type="button"
                        className="candidate-view-cancel"
                        onClick={close}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}