import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../services/officerService";
import "./Dashboard.css";

const defaultData = {
    activeElections: 0,
    totalVoters: 0,
    votesCast: 0,
    pendingApplications: 0,
    activeElectionList: [],
    recentApplications: [],
    totalCandidates: 0,
    approvedCandidates: 0,
    rejectedCandidates: 0,
    turnout: 0
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState(defaultData);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const res = await getDashboard();
            const payload = res?.data ?? res ?? {};
            setData({
                ...defaultData,
                ...payload,
                activeElectionList: Array.isArray(payload.activeElectionList)
                    ? payload.activeElectionList
                    : [],
                recentApplications: Array.isArray(payload.recentApplications)
                    ? payload.recentApplications
                    : []
            });
        } catch (err) {
            console.log(err);
            setData(defaultData);
        }
    };

    return (
        <div className="officer-dashboard">
            <h1>Election Officer Dashboard</h1>
            <p>Welcome to Election Officer Portal</p>

            <div className="dashboard-cards">
                <div className="card">
                    <h3>Active Elections</h3>
                    <h2>{data.activeElections}</h2>
                </div>

                <div className="card">
                    <h3>Total Voters</h3>
                    <h2>{data.totalVoters}</h2>
                </div>

                <div className="card">
                    <h3>Votes Cast</h3>
                    <h2>{data.votesCast}</h2>
                </div>

                <div className="card">
                    <h3>Pending Applications</h3>
                    <h2>{data.pendingApplications}</h2>
                </div>
            </div>

            <div className="section">
                <h2>Quick Actions</h2>

                <div className="action-row">
                    <button type="button" className="action-btn" onClick={() => navigate("/officer/elections")}>
                        <i className="fas fa-plus-circle"></i>
                        Create Election
                    </button>

                    <button type="button" className="action-btn" onClick={() => navigate("/officer/positions")}>
                        <i className="fas fa-list"></i>
                        Add Position
                    </button>

                    <button type="button" className="action-btn" onClick={() => navigate("/officer/applications")}>
                        <i className="fas fa-user-check"></i>
                        Review Candidates
                    </button>

                    <button type="button" className="action-btn" onClick={() => navigate("/officer/results")}>
                        <i className="fas fa-chart-bar"></i>
                        Generate Results
                    </button>

                    <button type="button" className="action-btn" onClick={() => navigate("/officer/live-voting")}>
                        <i className="fas fa-broadcast-tower"></i>
                        Live Voting
                    </button>
                </div>
            </div>

            <div className="section">
                <h2>Active Elections</h2>

                <div className="table-box">
                    <table>
                        <thead>
                            <tr>
                                <th>Election</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data.activeElectionList) && data.activeElectionList.length > 0 ? (
                                data.activeElectionList.map((e) => (
                                    <tr key={e.election_id}>
                                        <td>{e.election_name}</td>
                                        <td>{e.starts}</td>
                                        <td>{e.ends}</td>
                                        <td>{e.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No Active Elections</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="section">
                <h2>Recent Candidate Applications</h2>

                <div className="table-box">
                    <table>
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Election</th>
                                <th>Position</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data.recentApplications) && data.recentApplications.length > 0 ? (
                                data.recentApplications.map((c) => (
                                    <tr key={c.application_id}>
                                        <td>{c.full_name}</td>
                                        <td>{c.election_name}</td>
                                        <td>{c.position_name}</td>
                                        <td>{c.application_status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No Applications Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="section">
                <h2>Election Statistics</h2>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Candidates</h3>
                        <h2>{data.totalCandidates}</h2>
                    </div>

                    <div className="stat-card">
                        <h3>Approved</h3>
                        <h2>{data.approvedCandidates}</h2>
                    </div>

                    <div className="stat-card">
                        <h3>Rejected</h3>
                        <h2>{data.rejectedCandidates}</h2>
                    </div>

                    <div className="stat-card">
                        <h3>Turnout</h3>
                        <h2>{data.turnout}%</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}