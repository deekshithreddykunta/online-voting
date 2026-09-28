export default function ViewElectionModal({
    election,
    onClose
}) {
    if (!election) return null;

    return (
        <div className="election-view-overlay">
            <div className="election-view-modal">
                <div className="election-view-header">
                    <h2>View Election</h2>
                    <button
                        type="button"
                        className="election-view-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="election-view-details">
                    <div className="election-view-row">
                        <strong>Election Name</strong>
                        <span>{election.election_name}</span>
                    </div>

                    <div className="election-view-row">
                        <strong>Description</strong>
                        <span>{election.description || "N/A"}</span>
                    </div>

                    <div className="election-view-row">
                        <strong>Start Date</strong>
                        <span>{election.start_date}</span>
                    </div>

                    <div className="election-view-row">
                        <strong>Start Time</strong>
                        <span>{election.start_time}</span>
                    </div>

                    <div className="election-view-row">
                        <strong>End Date</strong>
                        <span>{election.end_date}</span>
                    </div>

                    <div className="election-view-row">
                        <strong>End Time</strong>
                        <span>{election.end_time}</span>
                    </div>

                    <div className="election-view-row">
                        <strong>Status</strong>
                        <span>
                            {election.status === "Active"
                                ? "🟢 Active"
                                : election.status === "Upcoming"
                                ? "🟡 Upcoming"
                                : "🔴 Completed"}
                        </span>
                    </div>
                </div>

                <div className="election-view-actions">
                    <button
                        type="button"
                        className="election-view-cancel"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}