import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getPositions,
    createPosition,
    updatePosition,
    deletePosition,
    getPositionById,
    getElections
} from "../../services/officerService";

import "./Positions.css";

export default function Positions() {

    const [positions, setPositions] = useState([]);
const [elections, setElections] = useState([]);
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editing, setEditing] = useState(false);

    const [editId, setEditId] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [deleteName, setDeleteName] = useState("");
    const [form, setForm] = useState({

        election_id: "",

        position_name: "",

        description: "",

        max_candidates: "",

        eligibility: "",

        status: "Active"

    });

    useEffect(() => {

    loadPositions();

    loadElections();

}, []);

    const loadPositions = async () => {

        try {

            const data = await getPositions();
        console.log(data);

            setPositions(data);

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to load positions.");

        }

    };
const loadElections = async () => {

    try {

        const data = await getElections();

        setElections(data.filter((e) => e.status !== "Completed"));

    }

    catch (err) {

        console.log(err);

        toast.error("Unable to load elections.");

    }

};
    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const openAdd = () => {

        setEditing(false);

        setEditId(null);

        setForm({

            election_id: "",

            position_name: "",

            description: "",

            max_candidates: "",

            eligibility: "",

            status: "Active"

        });

        setShowModal(true);

    };

    const openEdit = async (id) => {

        try {

            const data = await getPositionById(id);

            setEditing(true);

            setEditId(id);

            setForm(data);

            setShowModal(true);

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to load position.");

        }

    };
    const savePosition = async () => {

        try {

            if (
                !form.election_id ||
                !form.position_name ||
                !form.max_candidates
            ) {

                toast.error("Please fill all required fields.");

                return;

            }

            if (editing) {

                await updatePosition(editId, form);

                toast.success("Position updated successfully.");

            } else {

                await createPosition(form);

                toast.success("Position created successfully.");

            }

            setShowModal(false);

            loadPositions();

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Unable to save position."

            );

        }

    };

  const removePosition = async () => {

    try {

        await deletePosition(deleteId);

        toast.success("Position deleted successfully.");

        setShowDeleteConfirm(false);
        setDeleteId(null);
        setDeleteName("");

        loadPositions();

    }

    catch (err) {

        console.log(err);

        toast.error(
            err.response?.data?.message || "Unable to delete position."
        );

    }

};

    const filteredPositions = positions.filter((item) =>

        item.position_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

    );

    return (

        <div className="positions-page">

            <div className="page-header">

                <h2>Positions</h2>

                <button
                    className="add-btn"
                    onClick={openAdd}
                >
                    + Add Position
                </button>

            </div>

            <input
                type="text"
                placeholder="Search position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-box"
            />

            <table className="position-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Election</th>

                        <th>Position</th>

                        <th>Description</th>

                        <th>Max</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredPositions.length === 0 ?

                            <tr>

                                <td colSpan="7">

                                    No Positions Found

                                </td>

                            </tr>

                            :

                            filteredPositions.map((item) => (

                                <tr key={item.position_id}>

                                    <td>{item.position_id}</td>

                                    <td>{item.election_name}</td>

                                    <td>{item.position_name}</td>

                                    <td>{item.description}</td>

                                    <td>{item.max_candidates}</td>

                                    <td>{item.status}</td>

                                    <td>

                                        <button
                                            onClick={() => openEdit(item.position_id)}
                                        >
                                            Edit
                                        </button>

                                       <button
    onClick={() => {
        setDeleteId(item.position_id);
        setDeleteName(item.position_name);
        setShowDeleteConfirm(true);
    }}
>
    Delete
</button>

                                    </td>

                                </tr>

                            ))

                    }

                </tbody>

            </table>

            {

                showModal &&

                <div className="modal">

                    <div className="modal-content">

                        <h3>

                            {

                                editing

                                    ? "Edit Position"

                                    : "Add Position"

                            }

                        </h3>

                       <select
    name="election_id"
    value={form.election_id}
    onChange={handleChange}
>

    <option value="">Select Election</option>

{Array.isArray(elections) &&
    elections.map((e) => (
        <option
            key={e.election_id}
            value={e.election_id}
        >
            {e.election_name}
        </option>

    ))}

</select>

                        <input
                            type="text"
                            name="position_name"
                            placeholder="Position Name"
                            value={form.position_name}
                            onChange={handleChange}
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="max_candidates"
                            placeholder="Maximum Candidates"
                            value={form.max_candidates}
                            onChange={handleChange}
                        />

                        <textarea
                            name="eligibility"
                            placeholder="Eligibility"
                            value={form.eligibility}
                            onChange={handleChange}
                        />

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >

                            <option value="Active">Active</option>

                            <option value="Inactive">Inactive</option>

                        </select>

                        <div className="modal-buttons">

                            <button onClick={savePosition}>

                                {

                                    editing

                                        ? "Update"

                                        : "Save"

                                }

                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                </div>

            }
            {showDeleteConfirm && (
    <div className="delete-toast-overlay">
        <div className="delete-toast-box">
            <h3>Delete Position</h3>
            <p>Are you sure you want to delete <strong>{deleteName}</strong>?</p>

            <div className="delete-toast-actions">
                <button
                    className="cancel-btn"
                    onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteId(null);
                        setDeleteName("");
                        toast.info("Delete cancelled");
                    }}
                >
                    Cancel
                </button>

                <button
                    className="delete-confirm-btn"
                    onClick={removePosition}
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