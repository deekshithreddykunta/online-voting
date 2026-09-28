import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaFileAlt,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaVoteYea,
    FaUser,
    FaClipboardList,
    FaTrophy
} from "react-icons/fa";

import {
    getDashboard,
    getAvailableElections,
    getApplications
} from "../../services/candidateService";

import "./Dashboard.css";

export default function Dashboard() {

    const navigate = useNavigate();

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const [dashboard, setDashboard] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const [applications, setApplications] = useState([]);

    const [election, setElection] = useState(null);

    const [countdown, setCountdown] = useState("");

    const [time, setTime] = useState("");

    const [greeting, setGreeting] = useState("");

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const dashRes =
                await getDashboard();

            setDashboard(dashRes.data);

            const electionRes =
                await getAvailableElections();

            if (electionRes.data.length > 0) {

                setElection(electionRes.data[0]);

            }

            const appRes =
                await getApplications();

            setApplications(appRes.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        const updateClock = () => {

            const now = new Date();

            const hour = now.getHours();

            if (hour < 12) {

                setGreeting("Good Morning");

            }

            else if (hour < 17) {

                setGreeting("Good Afternoon");

            }

            else {

                setGreeting("Good Evening");

            }

            setTime(

                now.toLocaleTimeString(

                    "en-IN",

                    {

                        hour: "numeric",

                        minute: "2-digit",

                        second: "2-digit",

                        hour12: true

                    }

                )

            );

        };

        updateClock();

        const timer =
            setInterval(updateClock, 1000);

        return () => clearInterval(timer);

    }, []);

    useEffect(() => {

    if (!election) return;

    const updateCountdown = () => {

        // If the election is not active, don't show a countdown
        if (election.status !== "Active") {

            setCountdown("Election Closed");
            return;

        }

        const end = new Date(election.end_date);

        // End the election at 11:59:59 PM of the end date
        end.setHours(23, 59, 59, 999);

        const now = new Date();

        const diff = end.getTime() - now.getTime();

        if (diff <= 0) {

            setCountdown("Election Closed");
            return;

        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        const seconds = Math.floor((diff / 1000) % 60);

        setCountdown(
            `${days}d ${hours}h ${minutes}m ${seconds}s`
        );

    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);

}, [election]);

    return (

        <div className="candidate-dashboard">

            <div className="dashboard-header">

                <div>

                    <h1>

                        {greeting},

                        {" "}

                        {user.full_name}

                        👋

                    </h1>

                    <p>

                        Welcome back to Secure Online Voting System

                    </p>

                </div>

                <div className="dashboard-time">

                    {time}

                </div>

            </div>

            <div className="stats-grid">

                <div className="stat-card blue">

                    <FaFileAlt className="card-icon" />

                    <h3>Total Applications</h3>

                    <h2>{dashboard.total}</h2>

                </div>

                <div className="stat-card orange">

                    <FaClock className="card-icon" />

                    <h3>Pending</h3>

                    <h2>{dashboard.pending}</h2>

                </div>

                <div className="stat-card green">

                    <FaCheckCircle className="card-icon" />

                    <h3>Approved</h3>

                    <h2>{dashboard.approved}</h2>

                </div>

                <div className="stat-card red">

                    <FaTimesCircle className="card-icon" />

                    <h3>Rejected</h3>

                    <h2>{dashboard.rejected}</h2>

                </div>

            </div>

            <div className="quick-actions">

                <button
                    onClick={() =>
                        navigate("/candidate/elections")
                    }
                >
                    <FaVoteYea />

                    Apply Election

                </button>

                <button
                    onClick={() =>
                        navigate("/candidate/my-nominations")
                    }
                >
                    <FaClipboardList />

                    My Nominations

                </button>

                <button
                    onClick={() =>
                        navigate("/candidate/results")
                    }
                >
                    <FaTrophy />

                    Results

                </button>

                <button
                    onClick={() =>
                        navigate("/candidate/profile")
                    }
                >
                    <FaUser />

                    My Profile

                </button>

            </div>
                    <div className="dashboard-content">

                <div className="left-panel">

                    <div className="dashboard-section">

                        <div className="section-header">

                            <h2>Active Election</h2>

                        </div>

                        {

                            election ?

                            <div className="election-card">

                                <h2>

                                    {election.election_name}

                                </h2>

                                <p>

                                    {election.description}

                                </p>

                                <div className="election-info">

                                    <div>

                                        <strong>Start Date</strong>

                                        <span>

                                            {

                                                new Date(

                                                    election.start_date

                                                ).toLocaleDateString()

                                            }

                                        </span>

                                    </div>

                                    <div>

                                        <strong>End Date</strong>

                                        <span>

                                            {

                                                new Date(

                                                    election.end_date

                                                ).toLocaleDateString()

                                            }

                                        </span>

                                    </div>

                                    <div>

                                        <strong>Status</strong>

                                        <span className="badge active">

                                            {election.status}

                                        </span>

                                    </div>

                                </div>

                                <div className="countdown-box">

                                    <h4>

                                        Election Ends In

                                    </h4>

                                    <h3>

                                        {countdown}

                                    </h3>

                                </div>

                                <button

                                    className="primary-btn"

                                    onClick={() =>

                                        navigate("/candidate/elections")

                                    }

                                >

                                    Apply Now

                                </button>

                            </div>

                            :

                            <div className="empty-box">

                                No Active Elections

                            </div>

                        }

                    </div>

                </div>

                <div className="right-panel">

                    <div className="dashboard-section">

                        <div className="section-header">

                            <h2>

                                Recent Applications

                            </h2>

                        </div>

                        {

                            applications.length === 0 ?

                            <div className="empty-box">

                                No Applications Found

                            </div>

                            :

                            <table className="application-table">

                                <thead>

                                    <tr>

                                        <th>Election</th>

                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        applications

                                        .slice(0,5)

                                        .map(app=>(

                                            <tr

                                                key={app.application_id}

                                            >

                                                <td>

                                                    {

                                                        app.election_name

                                                    }

                                                </td>

                                                <td>

                                                    <span

                                                        className={

                                                            `status-badge ${

                                                                app.status

                                                                .toLowerCase()

                                                            }`

                                                        }

                                                    >

                                                        {app.status}

                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}