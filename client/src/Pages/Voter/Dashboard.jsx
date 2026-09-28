import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { getActiveElection } from "../../services/electionService";
import { getVotingStatus } from "../../services/voteService";
import "./Dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [election, setElection] = useState(null);
    const [countdown, setCountdown] = useState("");
    const [isVotingClosed, setIsVotingClosed] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            // Active Election
            const electionRes = await getActiveElection();

            if (electionRes.data.length > 0) {
                setElection(electionRes.data[0]);
            } else {
                setElection(null);
            }

            // Voting Status
            const statusRes = await getVotingStatus();

            console.log("Voting Status:", statusRes.data);

            setHasVoted(statusRes.data.voted);

        } catch (err) {

            console.log(err);

        }

    };

    const convertTo24Hour = (time12h) => {

        let [time, modifier] = time12h.split(" ");

        let [hours, minutes] = time.split(":");

        hours = parseInt(hours);

        if (modifier === "PM" && hours !== 12)
            hours += 12;

        if (modifier === "AM" && hours === 12)
            hours = 0;

        return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    useEffect(() => {

        if (!election) return;

        const updateCountdown = () => {

            const endTime24 = convertTo24Hour(election.end_time);

            const end = new Date(
                `${election.end_date
                    .split("-")
                    .reverse()
                    .join("-")}T${endTime24}:00`
            );

            const now = new Date();

            const diff = end - now;

            if (diff <= 0) {

                setCountdown("Voting Closed");
                setIsVotingClosed(true);

                return;

            }

            setIsVotingClosed(false);

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            const hours = Math.floor(
                (diff / (1000 * 60 * 60)) % 24
            );

            const minutes = Math.floor(
                (diff / (1000 * 60)) % 60
            );

            const seconds = Math.floor(
                (diff / 1000) % 60
            );

            setCountdown(
                `${days}d ${hours}h ${minutes}m ${seconds}s`
            );

        };

        updateCountdown();

        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);

    }, [election]);

    return (

        <div className="voter-dashboard">

            <h1>
                Welcome, {user?.full_name || user?.username}!
            </h1>

            <p className="subtitle">
                Secure Online Voting System Dashboard
            </p>

            <div className="top-cards">

                <div className="card">
                    <h3>Active Elections</h3>
                    <div className="number">
                        {election && !isVotingClosed ? 1 : 0}
                    </div>
                </div>

                <div className="card">
                    <h3>Voting Status</h3>

                    <div
                        className={
                            hasVoted
                                ? "status voted"
                                : "status not-voted"
                        }
                    >
                        {hasVoted ? "Voted" : "Not Voted"}
                    </div>

                </div>

                <div className="card">
                    <h3>Election Ends In</h3>
                    <div className="countdown">
                        {election ? countdown : "No Active Election"}
                    </div>
                </div>

            </div>

            <h2 className="section-title">
                Available Election
            </h2>

            {election ? (

                <div className="election-card">

                    <div className="election-info">

                        <h3>{election.election_name}</h3>

                        <p className="election-description">
                            {election.description}
                        </p>

                        <div className="election-dates">

                            <div className="date-box">

                                <span className="date-title">
                                    Starts
                                </span>

                                <span className="date-value">
                                    {election.start_date}
                                </span>

                                <span className="time-value">
                                    {election.start_time}
                                </span>

                            </div>

                            <div className="date-box">

                                <span className="date-title">
                                    Ends
                                </span>

                                <span className="date-value">
                                    {election.end_date}
                                </span>

                                <span className="time-value">
                                    {election.end_time}
                                </span>

                            </div>

                        </div>

                        <span
                            className={
                                isVotingClosed
                                    ? "closed-badge"
                                    : "live-badge"
                            }
                        >
                            {isVotingClosed ? "Completed" : "Active"}
                        </span>

                    </div>

                    <div className="vote-section">

                        <button
                            className={
                                hasVoted || isVotingClosed
                                    ? "vote-btn disabled"
                                    : "vote-btn"
                            }
                            disabled={hasVoted || isVotingClosed}
                            onClick={() => navigate("/voter/vote")}
                        >
                            {hasVoted
                                ? "Already Voted"
                                : isVotingClosed
                                ? "Voting Closed"
                                : "Vote Now"}
                        </button>

                    </div>

                </div>

            ) : (

                <div className="election-card no-election">

                    <h3>No Active Election</h3>

                    <p>
                        There are currently no active elections.
                    </p>

                </div>

            )}

            <h2 className="section-title">
                Your Vote
            </h2>

            <div className="vote-status">

                <FaCheckCircle />

                <span>
                    {hasVoted
                        ? "You have successfully cast your vote."
                        : "You have not voted in this election."}
                </span>

            </div>

        </div>

    );

}