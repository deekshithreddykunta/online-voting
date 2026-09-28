import { useState } from "react";
import { createElection } from "../../services/officerService";
import { toast } from "react-toastify";
import "./CreateElection.css";

export default function CreateElection() {

    const [form, setForm] = useState({

        election_name: "",
        description: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        status: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await createElection(form);

            toast.success("Election Created Successfully");

            setForm({

                election_name: "",
                description: "",
                start_date: "",
                start_time: "",
                end_date: "",
                end_time: "",
                status: ""

            });

        }

        catch (err) {

            console.log(err);

            toast.error("Failed to Create Election");

        }

    };

    return (

        <div className="create-election">

            <h1>Create Election</h1>

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

                            <option value="">Auto Detect</option>
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
                        rows="5"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />

                </div>

                <button className="save-btn">

                    Create Election

                </button>

            </form>

        </div>

    );

}