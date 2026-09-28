import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Officers.css";

import AddOfficerModal from "./AddOfficerModal";
import EditOfficerModal from "../../components/Admin/EditOfficerModal";
import ViewOfficerModal from "../../components/Admin/ViewOfficerModal";

export default function Officer() {
    const [officers, setOfficers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const officersPerPage = 5;

    useEffect(() => {
        loadOfficers();
    }, []);

    const loadOfficers = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/admin/officers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOfficers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load officers.");
        }
    };

    const deleteOfficer = async () => {
        try {
            setIsDeleting(true);

            const token = localStorage.getItem("token");

            const res = await axios.delete(
                `http://localhost:5000/api/admin/officers/${deleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(res.data.message);

            setOfficers((prev) =>
                prev.filter((officer) => officer.user_id !== deleteId)
            );

            setShowDeleteConfirm(false);
            setDeleteId(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const officer = officers.find((o) => o.user_id === id);

            await axios.patch(
                `http://localhost:5000/api/admin/officers/${id}/status`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                officer?.is_active
                    ? "Election Officer deactivated successfully."
                    : "Election Officer activated successfully."
            );

            loadOfficers();
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to update officer status."
            );
        }
    };

    const filteredOfficers = officers.filter((officer) => {
        const q = search.toLowerCase();
        return (
            officer.full_name?.toLowerCase().includes(q) ||
            officer.email?.toLowerCase().includes(q) ||
            officer.employee_id?.toLowerCase().includes(q) ||
            officer.department?.toLowerCase().includes(q)
        );
    });

    const indexOfLastOfficer = currentPage * officersPerPage;
    const indexOfFirstOfficer = indexOfLastOfficer - officersPerPage;

    const currentOfficers = filteredOfficers.slice(
        indexOfFirstOfficer,
        indexOfLastOfficer
    );

    const totalPages = Math.ceil(filteredOfficers.length / officersPerPage);

    return (
        <div className="officers-page">
            <div className="officers-header">
                <h2 className="officers-title">Election Officers</h2>

                <button
                    type="button"
                    className="officers-add-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Officer
                </button>
            </div>

            <div className="officers-search">
                <input
                    type="text"
                    placeholder="Search by Name, Email, Employee ID or Department"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="officers-table-container">
                <table className="officers-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Employee ID</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th className="officers-action-column">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOfficers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="officers-no-data">
                                    No Election Officers Found
                                </td>
                            </tr>
                        ) : (
                            currentOfficers.map((officer) => (
                                <tr key={officer.user_id}>
                                    <td>{officer.user_id}</td>
                                    <td>{officer.full_name}</td>
                                    <td>{officer.email}</td>
                                    <td>{officer.employee_id}</td>
                                    <td>{officer.department}</td>
                                    <td>{officer.is_active ? "🟢 Active" : "🔴 Inactive"}</td>
                                    <td>
                                        <div className="officers-action-buttons">
                                            <div className="officers-action-row">
                                                <button
                                                    type="button"
                                                    className="officers-view-btn"
                                                    onClick={() => {
                                                        setSelectedOfficer(officer);
                                                        setShowView(true);
                                                    }}
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="officers-edit-btn"
                                                    onClick={() => {
                                                        setSelectedOfficer(officer);
                                                        setShowEdit(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </div>

                                            <div className="officers-action-row">
                                                <button
                                                    type="button"
                                                    className="officers-status-btn"
                                                    onClick={() => toggleStatus(officer.user_id)}
                                                >
                                                    {officer.is_active ? "Deactivate" : "Activate"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="officers-delete-btn"
                                                    onClick={() => {
                                                        setDeleteId(officer.user_id);
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
            </div>

            <div className="officers-pagination">
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        type="button"
                        key={index + 1}
                        className={currentPage === index + 1 ? "officers-active-page" : ""}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            {showModal && (
                <AddOfficerModal
                    close={() => setShowModal(false)}
                    refresh={loadOfficers}
                />
            )}

            {showEdit && (
                <EditOfficerModal
                    officer={selectedOfficer}
                    close={() => setShowEdit(false)}
                    refresh={loadOfficers}
                />
            )}

            {showView && (
                <ViewOfficerModal
                    officer={selectedOfficer}
                    close={() => setShowView(false)}
                />
            )}

            {showDeleteConfirm && (
                <div className="officers-modal-overlay">
                    <div className="officers-confirm-box">
                        <h3>Delete Officer</h3>
                        <p>Are you sure you want to delete this officer?</p>

                        <div className="officers-confirm-buttons">
                            <button
                                type="button"
                                className="officers-cancel-btn"
                                disabled={isDeleting}
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setDeleteId(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="officers-delete-confirm-btn"
                                disabled={isDeleting}
                                onClick={deleteOfficer}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}