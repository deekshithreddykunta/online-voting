export default function ViewPositionModal({ position, onClose }) {
    if (!position) return null;

    return (
        <div className="position-view-overlay">
            <div className="position-view-modal">
                <div className="position-view-header">
                    <h2>Position Details</h2>
                    <button
                        type="button"
                        className="position-view-close-icon"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="position-view-grid">
                    <div className="position-view-item">
                        <span>Position ID</span>
                        <p>{position.position_id}</p>
                    </div>

                    <div className="position-view-item">
                        <span>Election</span>
                        <p>{position.election_name}</p>
                    </div>

                    <div className="position-view-item">
                        <span>Position Name</span>
                        <p>{position.position_name}</p>
                    </div>

                    <div className="position-view-item">
                        <span>Maximum Candidates</span>
                        <p>{position.max_candidates}</p>
                    </div>

                    <div className="position-view-item full-width">
                        <span>Description</span>
                        <p>{position.description || "-"}</p>
                    </div>

                    <div className="position-view-item full-width">
                        <span>Eligibility</span>
                        <p>{position.eligibility || "-"}</p>
                    </div>

                    <div className="position-view-item full-width">
                        <span>Status</span>
                        <p>
                            {position.status === "Active"
                                ? "🟢 Active"
                                : "🔴 Inactive"}
                        </p>
                    </div>
                </div>

                <div className="position-view-actions">
                    <button
                        type="button"
                        className="position-view-close"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}