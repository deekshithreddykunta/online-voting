import { useEffect, useMemo, useState } from "react";
import { getVoterResults } from "../../services/resultService";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import "./Results.css";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#9333ea", "#0891b2"];

export default function Results() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        loadResults();
    }, []);

   const loadResults = async () => {
    try {
        const data = await getVoterResults();
        console.log("RESULT ROWS:", data);

        const rowsData = Array.isArray(data)
            ? data
            : Array.isArray(data?.elections)
                ? data.elections.flatMap((election) =>
                    (election.results || []).map((r) => ({
                        election_id: election.election_id,
                        election_name: election.election_name,
                        ...r
                    }))
                )
                : [];

        setRows(rowsData);
    } catch (err) {
        console.log(err);
        setRows([]);
    } finally {
        setLoading(false);
    }
};
    const groupedElections = useMemo(() => {
        const map = {};

        for (const row of rows) {
            const electionId = row.election_id ?? "unknown";

            if (!map[electionId]) {
                map[electionId] = {
                    election_id: electionId,
                    election_name: row.election_name || row.election || `Election ${electionId}`,
                    results: []
                };
            }

            map[electionId].results.push({
                position_name: row.position_name || "-",
                candidate_name: row.full_name || row.candidate_name || "-",
                party_name: row.party_name || "-",
                vote_count: Number(row.total_votes ?? row.vote_count ?? 0),
                percentage: row.vote_percentage ?? row.percentage ?? null,
                is_winner: row.is_winner === true || row.is_winner === "true" || row.is_winner === 1
            });
        }

        return Object.values(map);
    }, [rows]);

    if (loading) {
        return <h2>Loading Results...</h2>;
    }

    if (groupedElections.length === 0) {
        return (
            <div className="results-page">
                <h2>Results are not available until the election ends.</h2>
            </div>
        );
    }

    return (
        <div className="results-page">
            <h2>Election Results</h2>

            {groupedElections.map((electionData) => {
                const chartData = electionData.results.map((r) => ({
                    candidate_name: r.candidate_name,
                    vote_count: r.vote_count
                }));

                return (
                    <div key={electionData.election_id} style={{ marginBottom: "50px" }}>
                        <h3>{electionData.election_name}</h3>

                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Candidate</th>
                                    <th>Party</th>
                                    <th>Votes</th>
                                    <th>Percentage</th>
                                    <th>Winner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {electionData.results.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.position_name}</td>
                                        <td>{r.candidate_name}</td>
                                        <td>{r.party_name}</td>
                                        <td>{r.vote_count}</td>
                                        <td>{r.percentage !== null ? `${Number(r.percentage).toFixed(2)}%` : "-"}</td>
                                        <td>
                                            <span className={r.is_winner ? "winner-badge winner" : "winner-badge not-winner"}>
                                                {r.is_winner ? "Winner" : "Not Winner"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="chart-container">
                            <h2>Vote Count</h2>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={chartData}>
                                    <XAxis dataKey="candidate_name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="vote_count" fill="#2563eb" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-container">
                            <h2>Vote Share</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="vote_count"
                                        nameKey="candidate_name"
                                        outerRadius={140}
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            })}

            <button className="download-btn" onClick={() => window.print()}>
                Download PDF
            </button>
        </div>
    );
}