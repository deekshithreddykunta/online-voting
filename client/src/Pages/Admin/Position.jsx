import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


import "./Position.css";

import AddPositionModal from "./AddPositionModal";
import EditPositionModal from "../../components/Admin/EditPositionModal";
import ViewPositionModal from "../../components/Admin/ViewPositionModal";

export default function Position() {

    const [positions, setPositions] = useState([]);

    const [showAdd, setShowAdd] = useState(false);

    const [showEdit, setShowEdit] = useState(false);

    const [showView, setShowView] = useState(false);

    const [selectedPosition, setSelectedPosition] = useState(null);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const positionPerPage = 5;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        loadPositions();

    }, []);

    const loadPositions = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/admin/positions",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPositions(res.data);

        } catch (err) {

            console.log(err);

            toast.error("Failed to load positions.");

        }

    };

const deletePosition = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await axios.delete(

            `http://localhost:5000/api/admin/positions/${deleteId}`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        toast.success(res.data.message);

        setShowDeleteConfirm(false);

        setDeleteId(null);

        loadPositions();

    } catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Delete failed."

        );

    }

};
    const filtered = positions.filter(position =>

        position.position_name
            .toLowerCase()
            .includes(search.toLowerCase())

        ||

        position.election_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        position.status
            ?.toLowerCase()
            .includes(search.toLowerCase())

    );

    const last = currentPage * positionPerPage;

    const first = last - positionPerPage;

    const currentPositions = filtered.slice(first, last);

    const totalPages = Math.ceil(filtered.length / positionPerPage);
        return (

        <div className="position-page">

            <div className="position-header">

                <h2>Positions</h2>

                <button
                    className="position-add-btn"
                    onClick={() => setShowAdd(true)}
                >
                    + Add Position
                </button>

            </div>

            <div className="position-search">

                <input
                    type="text"
                    placeholder="Search Position..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

            </div>

            <table className="position-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Election</th>

                        <th>Position</th>

                        <th>Max Candidates</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {currentPositions.length === 0 ? (

                        <tr className="position-no-data-row">
    <td colSpan="6" className="position-no-data">
        No Positions Found
    </td>
</tr>

                    ) : (

                        currentPositions.map((position) => (

                            <tr key={position.position_id}>

                                <td>{position.position_id}</td>

                                <td>{position.election_name}</td>

                                <td>{position.position_name}</td>

                                <td>{position.max_candidates}</td>

                                <td>

                                    {position.status === "Active"

                                        ? "🟢 Active"

                                        : "🔴 Inactive"}

                                </td>

                                <td>

                                    <div className="position-actions">

                                        <div className="position-action-row">

                                            <button

                                                className="position-view"

                                                onClick={() => {

                                                    setSelectedPosition(position);

                                                    setShowView(true);

                                                }}

                                            >

                                                View

                                            </button>

                                            <button

                                                className="position-edit"

                                                onClick={() => {

                                                    setSelectedPosition(position);

                                                    setShowEdit(true);

                                                }}

                                            >

                                                Edit

                                            </button>

                                        </div>

                                        <div className="position-actions">
                                        <div className="position-action-row">


                                            <button

                                                className="position-delete"

                                               onClick={() => {

    setDeleteId(position.position_id);

    setShowDeleteConfirm(true);

}}
                                            >

                                                Delete

                                            </button>

                                        </div>
                                        </div>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

            <div className="position-pagination">

                <button

                    disabled={currentPage === 1}

                    onClick={() =>

                        setCurrentPage(currentPage - 1)

                    }

                >

                    Previous

                </button>

                {

                    Array.from(

                        { length: totalPages },

                        (_, index) => (

                            <button

                                key={index}

                                className={

                                    currentPage === index + 1

                                        ? "active-page"

                                        : ""

                                }

                                onClick={() =>

                                    setCurrentPage(index + 1)

                                }

                            >

                                {index + 1}

                            </button>

                        )

                    )

                }

                <button

                    disabled={currentPage === totalPages}

                    onClick={() =>

                        setCurrentPage(currentPage + 1)

                    }

                >

                    Next

                </button>

            </div>

            {showAdd && (

                <AddPositionModal

                    onClose={() => setShowAdd(false)}

                    refreshPositions={loadPositions}

                />

            )}

            {showEdit && (

                <EditPositionModal

                    position={selectedPosition}

                    onClose={() => setShowEdit(false)}

                    refreshPositions={loadPositions}

                />

            )}

            {showView && (

                <ViewPositionModal

                    position={selectedPosition}

                    onClose={() => setShowView(false)}

                />

            )}
            {showDeleteConfirm && (

    <div className="position-modal-overlay">

        <div className="position-modal">

            <h2>Delete Position</h2>

            <p>

                Are you sure you want to delete this position?

            </p>

            <div className="position-modal-buttons">

                <button
                    className="position-cancel"
                    onClick={() => {

                        setShowDeleteConfirm(false);

                        setDeleteId(null);

                    }}
                >
                    Cancel
                </button>

                <button
                    className="position-delete"
                    onClick={deletePosition}
                >
                    Delete
                </button>

            </div>

        </div>

    </div>

)}

        </div>

    );

}