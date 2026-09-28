import { useEffect, useState } from "react";
import {
    getPositions,
    applyElection
} from "../services/candidateService";
import { toast } from "react-toastify";
import "./ApplyElectionModal.css";

export default function ApplyElectionModal({

    election,

    onClose

}) {

    const [positions, setPositions] = useState([]);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        position_id: "",

        constituency: ""

    });

    useEffect(() => {

        loadPositions();

    }, []);

    const loadPositions = async () => {

        try {

            const res = await getPositions(

                election.election_id

            );

            setPositions(res.data);

        }

        catch (err) {

            console.log(err);

            toast.error("Unable to load positions.");

        }

    };

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.position_id) {

            toast.error("Please select a position.");

            return;

        }

        if (!form.constituency.trim()) {

            toast.error("Please enter constituency.");

            return;

        }

        try {

            setLoading(true);

            const res = await applyElection({

                election_id: election.election_id,

                position_id: form.position_id,

                constituency: form.constituency

            });

            toast.success(res.data.message);

            onClose();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Application failed."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    Apply For Election

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>

                            Election

                        </label>

                        <input

                            type="text"

                            value={election.election_name}

                            readOnly

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Position

                        </label>

                        <select

                            name="position_id"

                            value={form.position_id}

                            onChange={handleChange}

                            required

                        >

                            <option value="">

                                Select Position

                            </option>

                            {positions.map(position => (

                                <option

                                    key={position.position_id}

                                    value={position.position_id}

                                >

                                    {position.position_name}

                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="form-group">

                        <label>

                            Constituency

                        </label>

                        <input

                            type="text"

                            name="constituency"

                            value={form.constituency}

                            onChange={handleChange}

                            placeholder="Enter Constituency"

                            required

                        />

                    </div>

                    <div className="modal-buttons">

                        <button

                            type="button"

                            className="cancel-btn"

                            onClick={onClose}

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="submit-btn"

                            disabled={loading}

                        >

                            {

                                loading

                                ?

                                "Submitting..."

                                :

                                "Submit Application"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}