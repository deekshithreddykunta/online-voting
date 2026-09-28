console.log("Election.jsx loaded");
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./Election.css";

import AddElectionModal from "../../components/Admin/AddElectionModal";
import EditElectionModal from "../../components/Admin/EditElectionModal";
import ViewElectionModal from "../../components/Admin/ViewElectionModal";

export default function Election() {

    const [elections, setElections] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [showView, setShowView] = useState(false);

    const [selectedElection, setSelectedElection] = useState(null);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const electionPerPage = 5;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        loadElections();

    }, []);

 useEffect(() => {
    console.log("Election page mounted");
    loadElections();
}, []);

const loadElections = async () => {
    

    console.log("loadElections called");

    try {

        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const res = await axios.get(
            "https://online-voting-qss7.onrender.com/api/admin/elections",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Response:", res.data);
console.log(res.data);
        setElections(res.data);
        

    } catch (err) {

        console.log("ERROR:", err);

    }

};
const filtered = elections.filter((election) =>

    election.election_name
        .toLowerCase()
        .includes(search.toLowerCase())

    ||

    election.status
        .toLowerCase()
        .includes(search.toLowerCase())

);
const last = currentPage * electionPerPage;

const first = last - electionPerPage;

const currentElections = filtered.slice(first, last);

const totalPages = Math.ceil(filtered.length / electionPerPage);
const confirmDelete = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.delete(

            `https://online-voting-qss7.onrender.com/api/admin/elections/${deleteId}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        toast.success(res.data.message);

        setShowDeleteConfirm(false);

        setDeleteId(null);

        loadElections();

    } catch (err) {

        toast.error(
            err.response?.data?.message ||
            "Delete failed."
        );

    }

};
    return (

        <div className="election-page">

            <div className="election-header">

                <h2>Election Management</h2>

                <button
                    className="add-btn"
                    onClick={() => setShowAdd(true)}
                >
                    + Create Election
                </button>

            </div>
<div className="search-box">

    <input
        type="text"
        placeholder="Search Election..."
        value={search}
        onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
        }}
    />

</div>
<table className="election-table">

    <thead>

        <tr>

            <th>ID</th>

            <th>Election Name</th>

            <th>Start Date</th>

            <th>End Date</th>

            <th>Status</th>

            <th>Action</th>

        </tr>

    </thead>

    <tbody>

        {currentElections.length === 0 ? (

            <tr>

                <td
                    colSpan={6}
                    className="no-data"
                >
                    No Elections Found
                </td>

            </tr>

        ) : (

            currentElections.map((election) => (

                <tr key={election.election_id}>

                    <td>{election.election_id}</td>

                    <td>{election.election_name}</td>

                    <td>{election.start_date}</td>

                    <td>{election.end_date}</td>

                    <td>

                        {election.status === "Active"
                            ? "🟢 Active"
                            : election.status === "Upcoming"
                            ? "🟡 Upcoming"
                            : "🔴 Completed"}

                    </td>

                    <td>

                        <div className="action-buttons">

                            <div className="action-row">

                                <button
                                    className="view-btn"
                                    onClick={() => {
                                        setSelectedElection(election);
                                        setShowView(true);
                                    }}
                                >
                                    View
                                </button>

                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setSelectedElection(election);
                                        setShowEdit(true);
                                    }}
                                >
                                    Edit
                                </button>

                            </div>

                            <div className="action-row">

                                <button
                                    className="delete-btn"
                                    onClick={() => {
                                        setDeleteId(election.election_id);
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

    {Array.from(
        { length: totalPages },
        (_, index) => (

            <button
                key={index}
                className={
                    currentPage === index + 1
                        ? "active-page"
                        : ""
                }
                onClick={() => setCurrentPage(index + 1)}
            >
                {index + 1}
            </button>

        )
    )}

    <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
    >
        Next
    </button>

</div>
{showAdd && (
    <AddElectionModal
        onClose={() => setShowAdd(false)}
        refreshElections={loadElections}
    />
)}
{showView && (
    <ViewElectionModal
        election={selectedElection}
        onClose={() => setShowView(false)}
    />
)}
{showEdit && (
    <EditElectionModal
        election={selectedElection}
        onClose={() => setShowEdit(false)}
        refreshElections={loadElections}
    />
)}
{showDeleteConfirm && (

    <div className="modal-overlay">

        <div className="delete-modal">

            <h3>Delete Election</h3>

            <p>
                Are you sure you want to delete this election?
            </p>

            <div className="delete-buttons">

                <button
                    className="delete-btn"
                    onClick={confirmDelete}
                >
                    Yes, Delete
                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {

                        setShowDeleteConfirm(false);

                        setDeleteId(null);

                    }}
                >
                    Cancel
                </button>

            </div>

        </div>

    </div>

)}
        </div>

    );

}