import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveElections } from "../../services/electionService";
import { getVotingStatus } from "../../services/voteService";
import "./AvailableElections.css";

export default function AvailableElections() {

    const navigate = useNavigate();

    const [elections, setElections] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);

    const [selectedElection, setSelectedElection] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            const electionRes = await getActiveElections();
            setElections(electionRes.data);

            const voteRes = await getVotingStatus();
            setHasVoted(voteRes.data.voted);

        } catch (err) {

            console.log(err);

        }

    };
  const getCountdown = (endDate, endTime) => {

    // Convert DD-MM-YYYY
    const [day, month, year] = endDate.split("-");

    // Convert 10:03 PM -> 22:03
    let [time, modifier] = endTime.split(" ");

    let [hours, minutes] = time.split(":");

    hours = parseInt(hours);

    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    const formattedHours = String(hours).padStart(2, "0");

    const end = new Date(
        `${year}-${month}-${day}T${formattedHours}:${minutes}:00`
    );

    const now = new Date();

    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Election Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d ${hrs}h ${mins}m remaining`;

};

    

    return (

        <div className="available-page">

            <h1>Available Elections</h1>

            {

                elections.length === 0 ?

                <div className="no-election">

                    No Active Elections

                </div>

                :

                elections.map((election) => (

                    <div
                        className="available-card"
                        key={election.election_id}
                    >

                        <h2>{election.election_name}</h2>

                        <p>{election.description}</p>

                        <div className="dates">

                            <div>

                                <strong>Start</strong>

                                <br />

                                {election.start_date}

                                <br />

                                {election.start_time}

                            </div>

                            <div>

                                <strong>End</strong>

                                <br />

                                {election.end_date}

                                <br />

                                {election.end_time}

                            </div>

                        </div>

                        <span className="active-badge">

                            Active

                        </span>

                        <p className="countdown">

                            {getCountdown(
                                election.end_date,
                                election.end_time
                            )}

                        </p>

                        <div className="button-group">

                            <button

                                className="details-btn"

                                onClick={() => {

                                    setSelectedElection(election);

                                    setShowDetails(true);

                                }}

                            >

                                View Details

                            </button>

                            <button

                                disabled={hasVoted}

                                className={
                                    hasVoted
                                        ? "disabled-btn"
                                        : "vote-btn"
                                }

                                onClick={() => navigate("/voter/vote")}

                            >

                                {

                                    hasVoted

                                        ? "Already Voted"

                                        : "Vote Now"

                                }

                            </button>

                        </div>

                    </div>

                ))

            }

            {

                showDetails && selectedElection && (

                    <div className="popup-overlay">

                        <div className="popup">

                            <h2>

                                {selectedElection.election_name}

                            </h2>

                            <p>

                                {selectedElection.description}

                            </p>

                            <hr />

                            <h3>

                                Election Schedule

                            </h3>

                            <p>

                                <strong>Start :</strong>{" "}

                                {selectedElection.start_date}{" "}

                                {selectedElection.start_time}

                            </p>

                            <p>

                                <strong>End :</strong>{" "}

                                {selectedElection.end_date}{" "}

                                {selectedElection.end_time}

                            </p>

                            <p className="countdown">

                                {getCountdown(
                                    selectedElection.end_date,
                                    selectedElection.end_time
                                )}

                            </p>

                            <button

                                className="details-btn"

                                onClick={() => setShowDetails(false)}

                            >

                                Close

                            </button>

                        </div>

                    </div>

                )

            }

        </div>

    );

}