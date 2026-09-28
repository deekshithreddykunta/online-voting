import "./AddVoterModal.css";

export default function ViewVoterModal({
    show,
    voter,
    onClose
}) {

    if (!show || !voter) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-box">

                <h2>Voter Details</h2>

                <div className="view-details">

                    <p><strong>ID:</strong> {voter.user_id}</p>

                    <p><strong>Voter ID:</strong> {voter.voter_id}</p>

                    <p><strong>Full Name:</strong> {voter.full_name}</p>

                    <p><strong>Username:</strong> {voter.username}</p>

                    <p><strong>Email:</strong> {voter.email}</p>

                    <p><strong>Phone:</strong> {voter.phone}</p>

                    <p><strong>Status:</strong> {voter.status}</p>

                    <p>
    <strong>Registered:</strong>{" "}
    {voter.created_at
        ? new Date(voter.created_at).toLocaleDateString()
        : "N/A"}
</p>
                </div>

                <div className="modal-buttons">

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}