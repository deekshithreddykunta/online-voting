import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getLiveVoting } from "../../services/officerService";
import "./LiveVoting.css";

export default function LiveVoting() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState({
        hasElection: false,
        election: null,
        positions: []
    });
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showManifesto, setShowManifesto] = useState(false);

    useEffect(() => {
        loadLiveVoting();

        const interval = setInterval(() => {
            loadLiveVoting(true);
        }, 15000);

        return () => clearInterval(interval);
    }, []);
const [stats, setStats] = useState({
    total_voters: 0,
    votes_cast: 0,
    turnout: 0,
    votes_remaining: 0
});
    const loadLiveVoting = async (silent = false) => {
        try {
            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

          const res = await getLiveVoting();
setData({
    hasElection: !!res?.hasElection,
    election: res?.election || null,
    positions: Array.isArray(res?.positions) ? res.positions : []
});
setStats({
    total_voters: res?.stats?.total_voters || 0,
    votes_cast: res?.stats?.votes_cast || 0,
    turnout: res?.stats?.turnout || 0,
    votes_remaining: res?.stats?.votes_remaining || 0
});
        } catch (err) {
            console.log(err);
            toast.error("Unable to load live voting data.");
            setData({
                hasElection: false,
                election: null,
                positions: []
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const electionInfo = useMemo(() => {
        if (!data.election) return null;

        return {
            name: data.election.election_name,
            description: data.election.description,
            status: data.election.status,
            startDate: data.election.start_date,
            endDate: data.election.end_date,
            startTime: data.election.start_time,
            endTime: data.election.end_time
        };
    }, [data.election]);

    const openManifesto = (candidate) => {
        setSelectedCandidate(candidate);
        setShowManifesto(true);
    };

    if (loading) {
        return (
            <div className="live-voting-page">
                <h2>Loading live voting data...</h2>
            </div>
        );
    }

    if (!data.hasElection) {
        return (
            <div className="live-voting-page">
                <div className="live-voting-header">
                    <h1>Live Voting</h1>
                    <button
                        className="refresh-btn"
                        onClick={() => loadLiveVoting()}
                    >
                        Refresh
                    </button>
                </div>

                <div className="empty-state">
                    <h2>No active election found</h2>
                    <p>There is currently no election in Active status.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="live-voting-page">
            <div className="live-voting-header">
                <div>
                    <h1>Live Voting</h1>
                    {electionInfo && (
                        <p className="subtitle">
                            {electionInfo.name} {refreshing ? "• updating..." : "• live"}
                        </p>
                    )}
                </div>

                <button
                    className="refresh-btn"
                    onClick={() => loadLiveVoting()}
                    disabled={refreshing}
                >
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {electionInfo && (
                <div className="election-card">
                    <div className="election-top">
                        <div>
                            <h2>{electionInfo.name}</h2>
                            <p>{electionInfo.description || "No description available."}</p>
                        </div>
                        <span className="live-badge">Active</span>
                    </div>

                    <div className="election-meta">
                        <div>
                            <label>Start Date</label>
                            <span>{electionInfo.startDate || "-"}</span>
                        </div>
                        <div>
                            <label>End Date</label>
                            <span>{electionInfo.endDate || "-"}</span>
                        </div>
                        <div>
                            <label>Start Time</label>
                            <span>{electionInfo.startTime || "-"}</span>
                        </div>
                        <div>
                            <label>End Time</label>
                            <span>{electionInfo.endTime || "-"}</span>
                        </div>
                    </div>
                </div>
            )}
<div className="stats-grid">
    <div className="stat-card">
        <span className="stat-label">Total Voters</span>
        <span className="stat-value">{stats.total_voters}</span>
    </div>

    <div className="stat-card">
        <span className="stat-label">Votes Cast</span>
        <span className="stat-value">{stats.votes_cast}</span>
    </div>

    <div className="stat-card">
        <span className="stat-label">Turnout</span>
        <span className="stat-value">{stats.turnout}%</span>
    </div>

    <div className="stat-card">
        <span className="stat-label">Votes Remaining</span>
        <span className="stat-value">{stats.votes_remaining}</span>
    </div>
</div>
            <div className="positions-grid">
                {data.positions.length === 0 ? (
                    <div className="empty-state">
                        <h2>No active positions found</h2>
                    </div>
                ) : (
                    data.positions.map((position) => {
                        const candidates = parseCandidates(position.candidates);

                        return (
                            <div className="position-card" key={position.position_id}>
                                <div className="position-header">
                                    <div>
                                        <h3>{position.position_name}</h3>
                                        <p>{position.description || "No description available."}</p>
                                    </div>
                                    <div className="position-badge">
                                        Max {position.max_candidates}
                                    </div>
                                </div>

                                <div className="candidate-grid">
                                    {candidates.length === 0 ? (
                                        <div className="no-candidate-box">
                                            No candidates available for this position.
                                        </div>
                                    ) : (
                                        candidates.map((candidate) => (
                                            <div className="candidate-card" key={candidate.candidate_id}>
                                                <div className="candidate-photo">
                                                    {candidate.photo ? (
                                                        <img
                                                            src={candidate.photo}
                                                            alt={candidate.full_name}
                                                        />
                                                    ) : (
                                                        <div className="photo-placeholder">
                                                            {candidate.full_name?.charAt(0)?.toUpperCase() || "C"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="candidate-info">
                                                    <h4>{candidate.full_name}</h4>
                                                    <p>{candidate.party_name || "No party"}</p>
                                                    <span className="vote-count">
                                                        Votes: {candidate.vote_count ?? 0}
                                                    </span>
                                                </div>

                                                <div className="candidate-actions">
                                                    <button
                                                        className="manifesto-btn"
                                                        onClick={() => openManifesto(candidate)}
                                                    >
                                                        View Manifesto
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showManifesto && selectedCandidate && (
                <div className="manifesto-overlay">
                    <div className="manifesto-modal">
                        <div className="manifesto-header">
                            <h2>{selectedCandidate.full_name}</h2>
                            <button
                                type="button"
                                className="close-btn"
                                onClick={() => setShowManifesto(false)}
                            >
                                ×
                            </button>
                        </div>

                        <p className="manifesto-party">
                            {selectedCandidate.party_name || "No party"}
                        </p>

                        <div className="manifesto-content">
                            {selectedCandidate.manifesto || "No manifesto available."}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="save-btn"
                                onClick={() => setShowManifesto(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function parseCandidates(candidates) {
    if (Array.isArray(candidates)) return candidates;

    if (typeof candidates === "string") {
        try {
            const parsed = JSON.parse(candidates);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
}