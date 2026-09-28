import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getVoters, verifyVoter ,getVotingStatus} from "../../services/officerService";
import "./Voters.css";

export default function Voters() {
    const [voters, setVoters] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
const [showStatusModal, setShowStatusModal] = useState(false);
const [selectedStatus, setSelectedStatus] = useState([]);
const [selectedVoterName, setSelectedVoterName] = useState("");
    useEffect(() => {
        loadVoters();
    }, []);

    const loadVoters = async (query = "") => {
        try {
            setLoading(true);
            const data = await getVoters(query);
            setVoters(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
            toast.error("Unable to load voters.");
            setVoters([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        loadVoters(value);
    };

    const handleVerify = async (id) => {
        try {
            await verifyVoter(id);
            toast.success("Voter verified successfully");
            loadVoters(search);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to verify voter");
        }
    };
const handleStatus = async (voter) => {
    console.log("Voting status voter:", voter);
    try {
        const data = await getVotingStatus(voter.user_id);
        setSelectedStatus(Array.isArray(data) ? data : []);
        setSelectedVoterName(voter.full_name);
        setShowStatusModal(true);
    } catch (err) {
        console.log(err);
        toast.error("Unable to load voting status");
    }
};
    return (
        <div className="officer-voters">
            <div className="page-header">
                <h1>Voters</h1>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, username, email, voter ID..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>Voter ID</th>
                            <th>Full Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Verified</th>
                            <th>Active</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9">Loading...</td>
                            </tr>
                        ) : voters.length === 0 ? (
                            <tr>
                                <td colSpan="9">No voters found</td>
                            </tr>
                        ) : (
                            voters.map((voter) => (
                                <tr key={voter.user_id}>
                                    <td>{voter.voter_id}</td>
                                    <td>{voter.full_name}</td>
                                    <td>{voter.username}</td>
                                    <td>{voter.email}</td>
                                    <td>{voter.phone}</td>
                                    <td>{voter.is_verified ? "Yes" : "No"}</td>
                                    <td>{voter.is_active ? "Active" : "Inactive"}</td>
                                    <td>{voter.created_at}</td>
                                    <td>
                                        <button
                                            className="verify-btn"
                                            onClick={() => handleVerify(voter.user_id)}
                                            disabled={voter.is_verified}
                                        >
                                            {voter.is_verified ? "Verified" : "Verify"}
                                        </button>
                                        <button
        className="status-btn"
        onClick={() => handleStatus(voter)}
    >
        Status
    </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
 {showStatusModal && (
    <div className="status-modal-overlay">
        <div className="status-modal-box">
            <h2>Voting Status - {selectedVoterName}</h2>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>Election</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedStatus.length === 0 ? (
                            <tr>
                                <td colSpan="2">No voting records found</td>
                            </tr>
                        ) : (
                            selectedStatus.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.election_name}</td>
                                    <td>{item.voting_status}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="status-modal-footer">
                <button
                    type="button"
                    className="save-btn"
                    onClick={() => setShowStatusModal(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

        </div>
    );
}