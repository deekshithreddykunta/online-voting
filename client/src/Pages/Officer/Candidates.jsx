import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getApplications,
    getApplicationById,
    approveApplication,
    rejectApplication,
    assignSymbol
} from "../../services/officerService";
import "./Candidates.css";

export default function Candidates() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showSymbolModal, setShowSymbolModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [symbol, setSymbol] = useState("");

    useEffect(() => {
        loadApplications();
    }, []);

   const loadApplications = async () => {
    try {
        setLoading(true);

        const res = await getApplications();
        console.log("APPLICATIONS RESPONSE:", res);

        setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
        console.log(err);
        toast.error("Unable to load applications");
        setApplications([]);
    } finally {
        setLoading(false);
    }
};

    const handleView = async (id) => {
    try {
        const res = await getApplicationById(id);
        console.log("APPLICATION DETAIL RESPONSE:", res);

        setSelectedApplication(res.data ?? res);
        setShowViewModal(true);
    } catch (err) {
        console.log(err);
        toast.error("Unable to load application details");
    }
};
    const handleApprove = async (id) => {
        try {
            await approveApplication(id, { remarks: "Approved by Election Officer" });
            toast.success("Candidate approved successfully");
            loadApplications();
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to approve candidate");
        }
    };

    const openReject = (id) => {
        setSelectedId(id);
        setRemarks("");
        setShowRejectModal(true);
    };

    const submitReject = async () => {
        try {
            await rejectApplication(selectedId, { remarks });
            toast.success("Candidate rejected successfully");
            setShowRejectModal(false);
            setSelectedId(null);
            loadApplications();
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to reject candidate");
        }
    };

    const openSymbol = (id) => {
        setSelectedId(id);
        setSymbol("");
        setShowSymbolModal(true);
    };

    const submitSymbol = async () => {
        try {
            await assignSymbol(selectedId, { symbol });
            toast.success("Symbol assigned successfully");
            setShowSymbolModal(false);
            setSelectedId(null);
            loadApplications();
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to assign symbol");
        }
    };

    const filteredApplications = applications.filter((item) => {
        const s = search.toLowerCase();
        return (
            item.full_name?.toLowerCase().includes(s) ||
            item.username?.toLowerCase().includes(s) ||
            item.email?.toLowerCase().includes(s) ||
            item.election_name?.toLowerCase().includes(s) ||
            item.position_name?.toLowerCase().includes(s) ||
            item.application_status?.toLowerCase().includes(s)
        );
    });

    return (
        <div className="officer-candidates">
            <div className="page-header">
                <h1>Candidate Applications</h1>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, email, election, position..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Election</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Applied At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6">Loading...</td>
                            </tr>
                        ) : filteredApplications.length === 0 ? (
                            <tr>
                                <td colSpan="6">No candidate applications found</td>
                            </tr>
                        ) : (
                            filteredApplications.map((item) => (
                                <tr key={item.application_id}>
                                    <td>{item.full_name}</td>
                                    <td>{item.election_name}</td>
                                    <td>{item.position_name}</td>
                                    <td>{item.application_status}</td>
                                    <td>{item.applied_at}</td>
                                    <td>
                                        <button className="view-btn" onClick={() => handleView(item.application_id)}>
                                            View
                                        </button>
                                        <button
                                            className="approve-btn"
                                            onClick={() => handleApprove(item.application_id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() => openReject(item.application_id)}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="symbol-btn"
                                            onClick={() => openSymbol(item.application_id)}
                                        >
                                            Assign Symbol
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showViewModal && selectedApplication && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Candidate Application Details</h2>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
                        </div>

                        <div className="details-grid">
                            <div><label>Name</label><p>{selectedApplication.full_name}</p></div>
                            <div><label>Username</label><p>{selectedApplication.username}</p></div>
                            <div><label>Email</label><p>{selectedApplication.email}</p></div>
                            <div><label>Phone</label><p>{selectedApplication.phone}</p></div>
                            <div><label>Voter ID</label><p>{selectedApplication.voter_id}</p></div>
                            <div><label>Election</label><p>{selectedApplication.election_name}</p></div>
                            <div><label>Position</label><p>{selectedApplication.position_name}</p></div>
                            <div><label>Party</label><p>{selectedApplication.party_name}</p></div>
                            <div><label>Constituency</label><p>{selectedApplication.constituency || "-"}</p></div>
                            <div><label>Qualification</label><p>{selectedApplication.qualification || "-"}</p></div>
                            <div><label>Experience</label><p>{selectedApplication.experience || "-"}</p></div>
                            <div><label>Manifesto</label><p>{selectedApplication.manifesto || "-"}</p></div>
                            <div><label>Status</label><p>{selectedApplication.application_status}</p></div>
                            <div className="full-width"><label>Remarks</label><p>{selectedApplication.remarks || "-"}</p></div>
                        </div>

                        <div className="modal-footer">
                            <button className="save-btn" onClick={() => setShowViewModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showRejectModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Reject Candidate</h2>
                            <button className="close-btn" onClick={() => setShowRejectModal(false)}>×</button>
                        </div>

                        <div className="form-group">
                            <label>Remarks</label>
                            <textarea
                                rows="4"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={() => setShowRejectModal(false)}>Cancel</button>
                            <button className="delete-confirm-btn" onClick={submitReject}>Reject</button>
                        </div>
                    </div>
                </div>
            )}

            {showSymbolModal && (
    <div className="candidate-modal-overlay">
        <div className="candidate-modal symbol-modal">
            <div className="candidate-modal-header">
                <div>
                    <h2>Assign Symbol</h2>
                    <p>Enter the symbol that will appear for this candidate.</p>
                </div>

                
            </div>

            <div className="candidate-modal-body">
                <div className="form-group">
                    <label>Symbol</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="e.g. Star, Lotus, Pen"
                    />
                </div>

                <div className="symbol-preview">
                    <span className="preview-label">Preview</span>
                    <div className="preview-chip">
                        {symbol?.trim() ? symbol : "No symbol selected"}
                    </div>
                </div>
            </div>

            <div className="candidate-modal-footer">
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowSymbolModal(false)}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="save-btn"
                    onClick={submitSymbol}
                >
                    Save Symbol
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
}