import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SubmitSuccess.css";

export default function SubmitSuccess() {

    const navigate = useNavigate();

    const [nomination, setNomination] = useState(null);

    useEffect(() => {

        const data = JSON.parse(
            sessionStorage.getItem("submittedNomination")
        );

        if (!data) {

            navigate("/candidate/dashboard");

            return;

        }

        setNomination(data);

    }, [navigate]);

    if (!nomination) return null;

    return (

        <div className="success-page">

            <div className="success-card">

                <div className="success-icon">

                    ✓

                </div>

                <h1>

                    Nomination Submitted Successfully

                </h1>

                <p>

                    Your nomination has been received successfully.
                    It is now awaiting Election Officer verification.

                </p>

                <div className="success-info">

                    <div>

                        <strong>Application ID</strong>

                        <span>

                            {nomination.application_id}

                        </span>

                    </div>

                    <div>

                        <strong>Election</strong>

                        <span>

                            {nomination.election_name}

                        </span>

                    </div>

                    <div>

                        <strong>Position</strong>

                        <span>

                            {nomination.position_name}

                        </span>

                    </div>

                    <div>

                        <strong>Status</strong>

                        <span className="pending">

                            Pending Verification

                        </span>

                    </div>

                    <div>

                        <strong>Submitted On</strong>

                        <span>

                            {new Date().toLocaleString()}

                        </span>

                    </div>

                </div>

                <div className="success-buttons">

                    <Link
                        to="/candidate/nominations"
                        className="primary-btn"
                    >

                        My Nominations

                    </Link>

                    <Link
                        to="/candidate/dashboard"
                        className="secondary-btn"
                    >

                        Dashboard

                    </Link>

                    <button

                        className="download-btn"

                        onClick={() => window.print()}

                    >

                        Download Receipt

                    </button>

                </div>

            </div>

        </div>

    );

}