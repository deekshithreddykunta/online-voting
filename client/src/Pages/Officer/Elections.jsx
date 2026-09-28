import { useEffect, useState } from "react";
import {
    getElections,
    createElection,
    getElectionById,
    updateElection,
    activateElection,
    deleteElection,
    closeElection
} from "../../services/officerService";
import "./Elections.css";
import { toast } from "react-toastify";
export default function Elections() {
    const [elections, setElections] = useState([]);
const [showCreateModal, setShowCreateModal,] = useState(false);
const [showViewModal, setShowViewModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [selectedElection, setSelectedElection] = useState(null);
const [form, setForm] = useState({

    election_name: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    status: ""

});
const [showEditModal, setShowEditModal] = useState(false);

const [editForm, setEditForm] = useState({
    election_id: "",
    election_name: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    status: ""
});
    useEffect(() => {

        loadElections();

    }, []);

    const loadElections = async () => {

        try {

            const data = await getElections();

setElections(Array.isArray(data) ? data : []);
        }

        catch (err) {

            console.log(err);
        setElections([]);

        }

    };
    const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({

        ...prev,

        [name]: value

    }));

};
const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        await createElection(form);

toast.success("Election created successfully");
        setShowCreateModal(false);

        setForm({

            election_name: "",
            description: "",
            start_date: "",
            start_time: "",
            end_date: "",
            end_time: "",
            status: ""

        });

        loadElections();

    }

    catch (err) {

        console.log(err);

toast.error("Failed to create election");
    }

};
const handleActivate = async (id) => {

    try {

        await activateElection(id);
        toast.success("Election activated successfully");

        loadElections();

    }

    catch (err) {

        console.log(err);

    }

};

const handleClose = async (id) => {

    try {

        await closeElection(id);
toast.success("Election closed successfully");
        loadElections();

    }

    catch (err) {

        console.log(err);

    }

};
const handleView = async (id) => {

    try {

        const res = await getElectionById(id);

        setSelectedElection(res.data);

        setShowViewModal(true);

    }

    catch (err) {

        console.log(err);

    }

};
const handleEdit = async (id) => {
    console.log("Edit clicked:", id);

    try {

        const res = await getElectionById(id);

        setEditForm(res.data);

        setShowEditModal(true);

    }

    catch (err) {

        console.log(err);

    }

};
const handleEditInput = (e) => {

    const { name, value } = e.target;

    setEditForm({

        ...editForm,

        [name]: value

    });

};
const handleUpdate = async (e) => {

    e.preventDefault();

    try {

        await updateElection(

            editForm.election_id,

            editForm

        );

toast.success("Election updated successfully");
        setShowEditModal(false);

        loadElections();

    }

    catch (err) {

        console.log(err);

    }

};
const handleDelete = async () => {

    try {

        await deleteElection(deleteId);

        toast.success("Election deleted successfully");

        setShowDeleteModal(false);

        setDeleteId(null);

        loadElections();

    }

    catch (err) {

        console.log(err);

        toast.error(
            err.response?.data?.message || "Failed to delete election"
        );

    }

};
    return (

        <div className="officer-elections">

            <div className="page-header">

                <h1>Elections</h1>
<button
    className="create-btn"
    onClick={() => setShowCreateModal(true)}
>

    + Create Election

</button>

            </div>

            <div className="table-box">

                <table>

                    <thead>

                        <tr>

                            <th>Election Name</th>

                            <th>Schedule</th>

                            <th>Status</th>

                            <th>Candidates</th>

                            <th>Votes</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {elections.map((election) => (

                            <tr key={election.election_id}>

                                <td>{election.election_name}</td>

                                <td>{election.schedule}</td>

                                <td>

                                    <span className={`status ${election.status.toLowerCase()}`}>

                                        {election.status}

                                    </span>

                                </td>

                                <td>{election.candidates}</td>

                                <td>{election.votes}</td>

                                <td>

    <div className="action-buttons">

        <button
            className="view-btn"
            onClick={() => handleView(election.election_id)}
        >
            View
        </button>

        <button
            className="edit-btn"
            disabled={election.status !== "Upcoming"}
            onClick={() => handleEdit(election.election_id)}
        >
            Edit
        </button>

        <button
            className="activate-btn"
            disabled={election.status !== "Upcoming"}
            onClick={() => handleActivate(election.election_id)}
        >
            Activate
        </button>

        <button
            className="close-btn"
            disabled={election.status !== "Active"}
            onClick={() => handleClose(election.election_id)}
        >
            Close
        </button>

        <button
            className="delete-btn"
            onClick={() => {
                setDeleteId(election.election_id);
                setShowDeleteModal(true);
            }}
        >
            Delete
        </button>

    </div>

</td>

                            </tr>

                        ))}

                    </tbody>

                </table>
                {showCreateModal && (

<div className="officer-modal-overlay">

    <div className="officer-modal">

        <div className="modal-header">

            <h2>Create Election</h2>

            

        </div>

        <form onSubmit={handleSubmit}>

            <div className="form-grid">

                <div>

                    <label>Election Name</label>

                    <input
                        type="text"
                        name="election_name"
                        value={form.election_name}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>Status</label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >

                        <option value="Upcoming">Upcoming</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>

                    </select>

                </div>

                <div>

                    <label>Start Date</label>

                    <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>Start Time</label>

                    <input
                        type="time"
                        name="start_time"
                        value={form.start_time}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>End Date</label>

                    <input
                        type="date"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>

                    <label>End Time</label>

                    <input
                        type="time"
                        name="end_time"
                        value={form.end_time}
                        onChange={handleChange}
                        required
                    />

                </div>

            </div>

            <div className="description-box">

                <label>Description</label>

                <textarea

                    rows="4"

                    name="description"

                    value={form.description}

                    onChange={handleChange}

                />

            </div>

            <div className="modal-footer">

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowCreateModal(false)}
                >

                    Cancel

                </button>

                <button
                    type="submit"
                    className="save-btn"
                >

                    Create Election

                </button>

            </div>

        </form>

    </div>

</div>

)}

{showViewModal && selectedElection && (
    <div className="officer-modal-overlay">
        <div className="officer-modal">
            <div className="officer-modal-header">
                <h2>Election Details</h2>
            </div>

            <div className="view-grid">
                <div>
                    <label>Election Name</label>
                    <p>{selectedElection.election_name}</p>
                </div>

                <div>
                    <label>Status</label>
                    <p>{selectedElection.status}</p>
                </div>

                <div>
                    <label>Start Date</label>
                    <p>{selectedElection.start_date}</p>
                </div>

                <div>
                    <label>Start Time</label>
                    <p>{selectedElection.start_time}</p>
                </div>

                <div>
                    <label>End Date</label>
                    <p>{selectedElection.end_date}</p>
                </div>

                <div>
                    <label>End Time</label>
                    <p>{selectedElection.end_time}</p>
                </div>

                <div className="full-width">
                    <label>Description</label>
                    <p>{selectedElection.description}</p>
                </div>
            </div>

            <div className="modal-footer">
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowViewModal(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}
{showEditModal && (

<div className="modal-overlay">

    <div className="modal">

        <div className="modal-header">

            <h2>Edit Election</h2>

            <button
                type="button"
                className="close-btn"
                onClick={() => setShowEditModal(false)}
            >
                ×
            </button>

        </div>

        <form onSubmit={handleUpdate}>

            <div className="form-grid">

                <div>

                    <label>Election Name</label>

                    <input
                        type="text"
                        name="election_name"
                        value={editForm.election_name}
                        onChange={handleEditInput}
                        required
                    />

                </div>

                <div>

                    <label>Status</label>

                    <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditInput}
                        required
                    >

                        <option value="Upcoming">Upcoming</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>

                    </select>

                </div>

                <div>

                    <label>Start Date</label>

                    <input
                        type="date"
                        name="start_date"
                        value={editForm.start_date}
                        onChange={handleEditInput}
                        required
                    />

                </div>

                <div>

                    <label>Start Time</label>

                    <input
                        type="time"
                        name="start_time"
                        value={editForm.start_time}
                        onChange={handleEditInput}
                        required
                    />

                </div>

                <div>

                    <label>End Date</label>

                    <input
                        type="date"
                        name="end_date"
                        value={editForm.end_date}
                        onChange={handleEditInput}
                        required
                    />

                </div>

                <div>

                    <label>End Time</label>

                    <input
                        type="time"
                        name="end_time"
                        value={editForm.end_time}
                        onChange={handleEditInput}
                        required
                    />

                </div>

            </div>

            <div className="description-box">

                <label>Description</label>

                <textarea
                    rows="4"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInput}
                />

            </div>

            <div className="modal-footer">

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditModal(false)}
                >

                    Cancel

                </button>

                <button
                    type="submit"
                    className="save-btn"
                >

                    Update Election

                </button>

            </div>

        </form>

    </div>

</div>

)}
{showDeleteModal && (

<div className="modal-overlay">

    <div className="delete-modal">

        <i
            className="fas fa-trash-alt delete-icon"
        ></i>

        <h2>Delete Election</h2>

        <p>

            Are you sure you want to delete this election?

            <br />

            This action cannot be undone.

        </p>

        <div className="delete-actions">

            <button
                className="cancel-btn"
                onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                }}
            >
                Cancel
            </button>

            <button
                className="delete-confirm-btn"
                onClick={handleDelete}
            >
                Delete
            </button>

        </div>

    </div>

</div>

)}
            </div>

        </div>

    );

}