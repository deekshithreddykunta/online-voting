import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
    getResults,
    publishResults,
    getElections,
    generateResults,
    getResultByElection
} from "../../services/officerService";
import "./Results.css";

export default function Results() {
    const [results, setResults] = useState([]);
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [electionFilter, setElectionFilter] = useState("All");
const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedReviewElection, setSelectedReviewElection] = useState("");
const [reviewResults, setReviewResults] = useState([]);
const [reviewLoading, setReviewLoading] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedElection, setSelectedElection] = useState("");
    const [generating, setGenerating] = useState(false);
const [showPublishModal, setShowPublishModal] = useState(false);
const [selectedPublishElection, setSelectedPublishElection] = useState("");
const [publishing, setPublishing] = useState(false);
    useEffect(() => {
        loadResults();
        loadElections();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            const data = await getResults();
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
            toast.error("Unable to load results.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const loadElections = async () => {
    try {
        const data = await getElections();
        setElections(
            Array.isArray(data)
                ? data.filter((e) => e.status !== "Active")
                : []
        );
    } catch (err) {
        console.log(err);
        toast.error("Unable to load elections.");
        setElections([]);
    }
};

    const resultElections = useMemo(() => {
        const unique = [...new Set(results.map((r) => r.election_name).filter(Boolean))];
        return unique;
    }, [results]);

    const filteredResults = useMemo(() => {
        return results.filter((item) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                item.election_name?.toLowerCase().includes(searchText) ||
                item.position_name?.toLowerCase().includes(searchText) ||
                item.full_name?.toLowerCase().includes(searchText) ||
                item.party_name?.toLowerCase().includes(searchText);

            const matchesElection =
                electionFilter === "All" ? true : item.election_name === electionFilter;

            return matchesSearch && matchesElection;
        });
    }, [results, search, electionFilter]);

    const handleGenerate = async () => {
        try {
            if (!selectedElection) {
                toast.error("Please select an election.");
                return;
            }

            setGenerating(true);

            await generateResults({
                election_id: selectedElection
            });

            toast.success("Results generated successfully.");
            setShowGenerateModal(false);
            setSelectedElection("");
            loadResults();
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Unable to generate results.");
        } finally {
            setGenerating(false);
        }
    };
const handleReview = async () => {
    try {
        if (!selectedReviewElection) {
            toast.error("Please select an election.");
            return;
        }

        setReviewLoading(true);

        const data = await getResultByElection(selectedReviewElection);
        setReviewResults(Array.isArray(data) ? data : []);
    } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Unable to load review results.");
        setReviewResults([]);
    } finally {
        setReviewLoading(false);
    }
};
const handlePublish = async () => {
    try {
        if (!selectedPublishElection) {
            toast.error("Please select an election.");
            return;
        }

        setPublishing(true);

        await publishResults({
            election_id: selectedPublishElection
        });

        toast.success("Results published successfully.");
        setShowPublishModal(false);
        setSelectedPublishElection("");
        loadResults();
    } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Unable to publish results.");
    } finally {
        setPublishing(false);
    }
};
    return (
        <div className="officer-results">
            <div className="page-header">
                <h1>Results</h1>
                <div className="header-actions">
                    <button
                        className="generate-btn"
                        onClick={() => setShowGenerateModal(true)}
                    >
                        Generate Results
                    </button>
                     <button
        className="review-btn"
        onClick={() => setShowReviewModal(true)}
    >
        Review Results
    </button>
    <button
    className="publish-btn"
    onClick={() => setShowPublishModal(true)}
>
    Publish Results
</button>
                    <button className="refresh-btn" onClick={loadResults}>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search election, position, candidate or party..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-box"
                />

                <select
                    value={electionFilter}
                    onChange={(e) => setElectionFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="All">All Elections</option>
                    {resultElections.map((election) => (
                        <option key={election} value={election}>
                            {election}
                        </option>
                    ))}
                </select>
            </div>

            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>Election</th>
                            <th>Position</th>
                            <th>Candidate</th>
                            <th>Party</th>
                            <th>Votes</th>
                            <th>Percentage</th>
                            <th>Rank</th>
                            <th>Winner</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8">Loading...</td>
                            </tr>
                        ) : filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan="8">No results found</td>
                            </tr>
                        ) : (
                            filteredResults.map((item) => (
                                <tr key={item.result_id}>
                                    <td>{item.election_name}</td>
                                    <td>{item.position_name}</td>
                                    <td>{item.full_name}</td>
                                    <td>{item.party_name || "-"}</td>
                                    <td>{item.total_votes ?? 0}</td>
                                    <td>
                                        {item.vote_percentage !== null &&
                                        item.vote_percentage !== undefined
                                            ? `${Number(item.vote_percentage).toFixed(2)}%`
                                            : "-"}
                                    </td>
                                    <td>{item.rank ?? "-"}</td>
                                    <td>
                                        <span
                                            className={
                                                item.is_winner
                                                    ? "winner-badge winner"
                                                    : "winner-badge not-winner"
                                            }
                                        >
                                            {item.is_winner ? "Winner" : "Not Winner"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showGenerateModal && (
    <div className="generate-modal-overlay">
        <div className="generate-modal-box">
            <div className="generate-modal-header">
                <h2>Generate Results</h2>
                <button
                    type="button"
                    className="generate-close-btn"
                    onClick={() => setShowGenerateModal(false)}
                >
                    ×
                </button>
            </div>

            <div className="form-group">
                <label>Select Election</label>
                <select
                    value={selectedElection}
                    onChange={(e) => setSelectedElection(e.target.value)}
                >
                    <option value="">Select Election</option>
                    {elections.map((election) => (
                        <option
                            key={election.election_id}
                            value={election.election_id}
                        >
                            {election.election_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="generate-modal-footer">
                <button
                    className="save-btn"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    {generating ? "Generating..." : "Generate"}
                </button>
                <button
                    className="cancel-btn"
                    onClick={() => setShowGenerateModal(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}
{showReviewModal && (
    <div className="generate-modal-overlay">
        <div className="generate-modal-box">
            <div className="generate-modal-header">
                <h2>Review Results</h2>
                <button
                    type="button"
                    className="generate-close-btn"
                    onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReviewElection("");
                        setReviewResults([]);
                    }}
                >
                    ×
                </button>
            </div>

            <div className="form-group">
                <label>Select Election</label>
                <select
                    value={selectedReviewElection}
                    onChange={(e) => setSelectedReviewElection(e.target.value)}
                >
                    <option value="">Select Election</option>
                    {elections.map((election) => (
                        <option
                            key={election.election_id}
                            value={election.election_id}
                        >
                            {election.election_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="generate-modal-footer">
                <button
                    className="save-btn"
                    onClick={handleReview}
                    disabled={reviewLoading}
                >
                    {reviewLoading ? "Loading..." : "Review"}
                </button>
                <button
                    className="cancel-btn"
                    onClick={() => {
                        setShowReviewModal(false);
                        setSelectedReviewElection("");
                        setReviewResults([]);
                    }}
                >
                    Close
                </button>
            </div>

            {reviewResults.length > 0 && (
                <div className="table-box" style={{ marginTop: "20px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Candidate</th>
                                <th>Party</th>
                                <th>Votes</th>
                                <th>Percentage</th>
                                <th>Rank</th>
                                <th>Winner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewResults.map((item) => (
                                <tr key={item.result_id}>
                                    <td>{item.position_name}</td>
                                    <td>{item.full_name}</td>
                                    <td>{item.party_name || "-"}</td>
                                    <td>{item.total_votes ?? 0}</td>
                                    <td>
                                        {item.vote_percentage !== null &&
                                        item.vote_percentage !== undefined
                                            ? `${Number(item.vote_percentage).toFixed(2)}%`
                                            : "-"}
                                    </td>
                                    <td>{item.rank ?? "-"}</td>
                                    <td>
                                        <span
                                            className={
                                                item.is_winner
                                                    ? "winner-badge winner"
                                                    : "winner-badge not-winner"
                                            }
                                        >
                                            {item.is_winner ? "Winner" : "Not Winner"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
)}
{showPublishModal && (
    <div className="generate-modal-overlay">
        <div className="generate-modal-box">
            <div className="generate-modal-header">
                <h2>Publish Results</h2>
               
            </div>

            <div className="form-group">
                <label>Select Election</label>
                <select
                    value={selectedPublishElection}
                    onChange={(e) => setSelectedPublishElection(e.target.value)}
                >
                    <option value="">Select Election</option>
                    {elections.map((election) => (
                        <option
                            key={election.election_id}
                            value={election.election_id}
                        >
                            {election.election_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="generate-modal-footer">
                <button
                    className="save-btn"
                    onClick={handlePublish}
                    disabled={publishing}
                >
                    {publishing ? "Publishing..." : "Publish"}
                </button>
                <button
                    className="cancel-btn"
                    onClick={() => setShowPublishModal(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
}