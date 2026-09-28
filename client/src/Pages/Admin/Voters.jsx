import { useEffect, useState } from "react";
import axios from "axios";
import "./Voters.css";
import AddVoterModal from "../../components/Admin/AddVoterModal";
import EditVoterModal from "../../components/Admin/EditVoterModal";
import { toast } from "react-toastify";
import ViewVoterModal from "../../components/Admin/ViewVoterModal";
import ResetPasswordModal from "../../components/Admin/ResetPasswordModal";
export default function Voters() {

const [voters, setVoters] = useState([]);
const [showModal, setShowModal] = useState(false);
const [showEdit, setShowEdit] = useState(false);
const [selectedVoter, setSelectedVoter] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);
const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage] = useState(5);
const [statusFilter, setStatusFilter] = useState("All");
const [showView, setShowView] = useState(false);
const [showResetModal, setShowResetModal] = useState(false);
const [selectedResetVoter, setSelectedResetVoter] = useState(null);
    useEffect(() => {
        loadVoters();
    }, []);

    const loadVoters = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "https://online-voting-qss7.onrender.com/api/admin/voters",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVoters(res.data);

        } catch (err) {

            console.log(err);

        }

    };
    const deleteVoter = async () => {

    setIsDeleting(true);

    try {

        const token = localStorage.getItem("token");

        const res = await axios.delete(
            `https://online-voting-qss7.onrender.com/api/admin/voters/${deleteId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        toast.success(
            res.data.message || "Voter deleted successfully!"
        );

        await loadVoters();

        setShowDeleteConfirm(false);
        setDeleteId(null);
        setIsDeleting(false);

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Delete failed"
        );

        setShowDeleteConfirm(false);
        setDeleteId(null);
        setIsDeleting(false);

    }

};
const filteredVoters = voters.filter((voter) => {

    const matchesSearch =
        voter.full_name.toLowerCase().includes(search.toLowerCase()) ||
        voter.email.toLowerCase().includes(search.toLowerCase()) ||
        (voter.username || "").toLowerCase().includes(search.toLowerCase()) ||
        voter.voter_id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
        statusFilter === "All" ||
        voter.status === statusFilter;

    return matchesSearch && matchesStatus;

});

const lastRow = currentPage * rowsPerPage;
const firstRow = lastRow - rowsPerPage;

const currentVoters = filteredVoters.slice(firstRow, lastRow);

const totalPages = Math.ceil(filteredVoters.length / rowsPerPage);
const toggleStatus = async (id) => {
    try {

        const token = localStorage.getItem("token");

        const res = await axios.patch(
            `https://online-voting-qss7.onrender.com/api/admin/voters/${id}/status`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        toast.success(res.data.message);

        loadVoters();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Failed to update voter status"
        );

    }
};
    
const exportCSV = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            "https://online-voting-qss7.onrender.com/api/admin/voters/export/csv",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob"
            }
        );

        const url = window.URL.createObjectURL(
            new Blob([response.data])
        );

        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", "voters.csv");

        document.body.appendChild(link);

        link.click();

        link.remove();

        toast.success("Voters exported successfully!");

    } catch (err) {

        toast.error("Failed to export voters.");

    }

};
   return (

    <div className="voters-page">

        <div className="voters-header">

            <h2 className="voters-title">
                Voters
            </h2>
            <div className="header-buttons">

        <button
            className="export-btn"
            onClick={exportCSV}
        >
            Export CSV
        </button>
            <button
                className="add-btn"
                onClick={() => setShowModal(true)}
            >
                + Add Voter
            </button>

        </div>
        </div>

        <div className="top-controls">

            <input
                type="text"
                placeholder="Search by Name, Email, Username or Voter ID"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}
                className="search-input"
            />

            <select
                value={statusFilter}
                onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                }}
                className="filter-select"
            >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
            </select>

        </div>

        
            <table className="voters-table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Voter ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                       <th>Status</th>
<th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {filteredVoters.length === 0 ? (
                        <tr>

                            <td
                                colSpan="7"
                                className="no-data"
                            >
                                No Voters Found
                            </td>

                        </tr>

                    ) : (
                            currentVoters.map((voter) => (

                            <tr key={voter.user_id}>

                                <td>{voter.user_id}</td>
                                <td>{voter.voter_id}</td>
                                <td>{voter.full_name}</td>
                                <td>{voter.email}</td>
                                <td>{voter.phone}</td>
                             <td>
    {voter.status === "Active"
        ? "🟢 Active"
        : "🔴 Inactive"}
</td>

<td>
    <div className="action-buttons">

        <div className="action-row">

            <button
                className="view-btn"
                onClick={() => {
                    setSelectedVoter(voter);
                    setShowView(true);
                }}
            >
                View
            </button>

            <button
                className="edit-btn"
                onClick={() => {
                    setSelectedVoter(voter);
                    setShowEdit(true);
                }}
            >
                Edit
            </button>

        </div>

        <div className="action-row">

            <button
                className="status-btn"
                onClick={() => toggleStatus(voter.user_id)}
            >
                {voter.status === "Active"
                    ? "Deactivate"
                    : "Activate"}
            </button>

            <button
                className="reset-btn"
                onClick={() => {
                    setSelectedResetVoter(voter);
                    setShowResetModal(true);
                }}
            >
                Reset
            </button>

            <button
                className="delete-btn"
                onClick={() => {
                    setDeleteId(voter.user_id);
                    setShowDeleteConfirm(true);
                }}
            >
                Delete
            </button>

        </div>

    </div>
</td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>
            <div className="pagination">

    <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
    >
        Previous
    </button>

    <span>
        Page {totalPages === 0 ? 0 : currentPage} of {totalPages || 1}
    </span>

    <button
        disabled={
            currentPage === totalPages ||
            totalPages === 0
        }
        onClick={() => setCurrentPage(currentPage + 1)}
    >
        Next
    </button>

</div>
<AddVoterModal
    show={showModal}
    onClose={() => setShowModal(false)}
    onSuccess={loadVoters}
/>
<ViewVoterModal
    show={showView}
    voter={selectedVoter}
    onClose={() => setShowView(false)}
/>
<EditVoterModal
    show={showEdit}
    voter={selectedVoter}
    onClose={() => setShowEdit(false)}
    onSuccess={loadVoters}
    
/>
{showDeleteConfirm && (

    <div className="modal-overlay">

        <div className="confirm-box">

            <h3>Delete Voter</h3>

            <p>
                Are you sure you want to delete this voter?
            </p>

            <div className="confirm-buttons">

                <button
                    className="cancel-btn"
                    disabled={isDeleting}
                    onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteId(null);
                    }}
                >
                    Cancel
                </button>

                <button
                    className="delete-confirm-btn"
                    disabled={isDeleting}
                    onClick={deleteVoter}
                >
                    Delete
                </button>

            </div>

        </div>

    </div>

)}
<ResetPasswordModal
    show={showResetModal}
    voter={selectedResetVoter}
    onClose={() => {
        setShowResetModal(false);
        setSelectedResetVoter(null);
    }}
/>
        </div>

    );

}