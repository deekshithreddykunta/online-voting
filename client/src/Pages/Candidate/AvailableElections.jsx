import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getAvailableElections,
    getApplications
} from "../../services/candidateService";
import { useNavigate } from "react-router-dom";
import "./AvailableElections.css";

export default function AvailableElections() {

    const navigate = useNavigate();

    const [elections, setElections] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);

            const electionRes = await getAvailableElections();
            const applicationRes = await getApplications();

            setElections(electionRes.data);
            setApplications(applicationRes.data);

        } catch (err) {

            console.log(err);
            toast.error("Unable to load elections.");

        } finally {

            setLoading(false);

        }

    };

    const alreadyApplied = (electionId) => {

        return applications.some(
            app => app.election_id === electionId
        );

    };

    if (loading) {

        return (
            <div className="loading">
                Loading Elections...
            </div>
        );

    }

    return (

        <div className="candidate-elections">

            <div className="page-header">

                <h1>Available Elections</h1>

                
            </div>

            {elections.length === 0 ? (

                <div className="no-election">

                    <h2>No Active Elections</h2>

                    <p>
                        There are currently no active elections.
                    </p>

                </div>

            ) : (

                <div className="election-grid">

                    {elections.map((election) => (

                        <div
                            className="election-card"
                            key={election.election_id}
                        >

                            <h2>
                                {election.election_name}
                            </h2>

                            <p className="description">
                                {election.description}
                            </p>

                            <div className="details">

                                
                                

                                

                                <div className="detail-row">

                                    <span className="label">
                                        Start Date
                                    </span>

                                    <span>
                                        {new Date(
                                            election.start_date
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                                <div className="detail-row">

                                    <span className="label">
                                        End Date
                                    </span>

                                    <span>
                                        {new Date(
                                            election.end_date
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                                <div className="detail-row">

                                    <span className="label">
                                        Status
                                    </span>

                                    <span className="status active">
                                        {election.status}
                                    </span>

                                </div>

                            </div>

                            {alreadyApplied(election.election_id) ? (

                                <button
                                    className="applied-btn"
                                    disabled
                                >
                                    ✓ Already Applied
                                </button>

                            ) : (

                                <button
                                    className="apply-btn"
                                    onClick={() =>
                                        navigate(
                                            `/candidate/nomination/${election.election_id}`
                                        )
                                    }
                                >
                                    Apply Now →
                                </button>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}