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
  LineChart,
  Line,
} from "recharts";

import "./DashboardCharts.css";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

export default function DashboardCharts({ dashboard }) {

  const voteData = [
    {
      election: "Active Elections",
      votes: dashboard.activeElections,
    },
    {
      election: "Candidates",
      votes: dashboard.candidates,
    },
    {
      election: "Voters",
      votes: dashboard.voters,
    },
    {
      election: "Officers",
      votes: dashboard.officers,
    },
  ];

  const userData = [
    {
      name: "Officers",
      value: dashboard.officers,
    },
    {
      name: "Voters",
      value: dashboard.voters,
    },
    {
      name: "Candidates",
      value: dashboard.candidates,
    },
    {
      name: "Active Elections",
      value: dashboard.activeElections,
    },
  ];

  const monthlyData = [
    { month: "Jan", users: 0 },
    { month: "Feb", users: 0 },
    { month: "Mar", users: 0 },
    { month: "Apr", users: 0 },
    { month: "May", users: dashboard.voters },
  ];

  return (
    <div className="charts-container">

      {/* Bar Chart */}

      <div className="chart-card">
        <h3>System Statistics</h3>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={voteData}>
            <XAxis dataKey="election" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="votes" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}

      <div className="chart-card">
        <h3>User Distribution</h3>

        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={userData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {userData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}

      <div className="chart-card full-width">
        <h3>Monthly Registrations</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#16a34a"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}