import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getResults } from "../../services/resultService";
import "./Results.css";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const COLORS = [
    "#2563eb",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4"
];
export default function Results() {

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
const [winners, setWinners] = useState([]);
 
const fetchResults = async () => {
        try {

            const data = await getResults();
            setResults(data);

        } catch (err) {

            console.log(err);
            toast.error("Failed to load results.");

        } finally {

            setLoading(false);

        }
    };
const fetchWinners = async () => {
    try {

        const token = localStorage.getItem("token");

        const res = await fetch(
            "http://localhost:5000/api/admin/results/winners",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        setWinners(data);

    } catch (err) {

        console.log(err);

    }
};
    useEffect(() => {
    fetchResults();
    fetchWinners();
}, []);
const chartData = results.map((item) => ({
    candidate: item.candidate_name,
    votes: Number(item.vote_count)
}));
const totalVotes = chartData.reduce(
    (sum, item) => sum + item.votes,
    0
);
const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Election Results Report", 14, 18);

    autoTable(doc, {
        startY: 30,
        head: [["Position", "Candidate", "Votes", "Percentage"]],
        body: results.map((item) => [
            item.position_name,
            item.candidate_name,
            item.vote_count,
            `${item.percentage || 0}%`
        ]),
    });

    doc.save("Election_Results.pdf");

    toast.success("PDF exported successfully!");
};
const exportExcel = () => {

    const excelData = results.map((item) => ({
        Position: item.position_name,
        Candidate: item.candidate_name,
        Votes: item.vote_count,
        Percentage: `${item.percentage || 0}%`
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Election Results"
    );

    XLSX.writeFile(
        workbook,
        "Election_Results.xlsx"
    );

    toast.success("Excel exported successfully!");
};
    return (
        <div className="results-page">

            <h2>Election Results</h2>
             <div className="export-buttons">

    <button
        onClick={exportPDF}
        className="pdf-btn"
    >
        📄 Export PDF
    </button>

    <button
        onClick={exportExcel}
        className="excel-btn"
    >
        📊 Export Excel
    </button>

</div>
          
            <div className="winner-card">

    <h3>🏆 Current Winners</h3>

    {winners.length > 0 ? (

        winners.map((winner, index) => (

            <div key={index} className="winner-item">

                <strong>{winner.position_name}</strong>

                <p>

                    {winner.winner}

                    <br />

                    Votes: {winner.vote_count}

                </p>

            </div>

        ))

    ) : (

        <p>No winners available.</p>

    )}

</div>

<div className="charts-container">
  {totalVotes > 0 ? (
    <>
      {/* Pie Chart */}
      <div className="chart-card">
        <h3>Vote Percentage</h3>

        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="candidate"
              outerRadius={120}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="chart-card">
        <h3>Vote Count</h3>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="candidate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  ) : (
    <div className="no-chart-results">
      <h3>No results available</h3>
      <p>No votes have been cast yet.</p>
    </div>
  )}
</div>
            {loading ? (

                <p>Loading...</p>

            ) : (
                <table className="results-table">

    <thead>

        <tr>

            <th>Position</th>

            <th>Candidate</th>

            <th>Votes</th>

            <th>Percentage</th>

        </tr>

    </thead>

    <tbody>

        {results.length > 0 ? (

            results.map((result, index) => (

                <tr key={index}>

                    <td>{result.position_name}</td>

                    <td>{result.candidate_name}</td>

                    <td>{result.vote_count}</td>

                    <td>{result.percentage || 0}%</td>

                </tr>

            ))

        ) : (

            <tr>

                <td
                    colSpan="4"
                    className="no-results"
                    
                >
                    No election results available.
                </td>

            </tr>

        )}

    </tbody>

</table>

                
            )}

        </div>
    );
}