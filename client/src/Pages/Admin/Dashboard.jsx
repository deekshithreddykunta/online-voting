import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaUsers,
  FaUserTie,
  FaVoteYea,
  FaUserShield,
} from "react-icons/fa";
import AddOfficerModal from "../../Pages/Admin/AddOfficerModal";
import AddVoterModal from "../../components/Admin/AddVoterModal";
import AddElectionModal from "../../components/Admin/AddElectionModal";
import StatsCard from "../../components/Admin/StatsCard";
import QuickActions from "../../components/Admin/QuickActions";
import DashboardCharts from "../../components/Admin/DashboardCharts";
import RecentElections from "../../components/Admin/RecentElections";
import "./Dashboard.css";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState({
    officers: 0,
    voters: 0,
    candidates: 0,
    activeElections: 0,

    voteChart: [],
    monthly: [],

    recentElections: [],

  });

  useEffect(() => {
    loadDashboard();
  }, []);
const [showOfficerModal, setShowOfficerModal] = useState(false);
const [showVoterModal, setShowVoterModal] = useState(false);
const [showElectionModal, setShowElectionModal] = useState(false);
  const loadDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard({
        officers: res.data.officers || 0,
        voters: res.data.voters || 0,
        candidates: res.data.candidates || 0,
        activeElections: res.data.activeElections || 0,

        voteChart: res.data.voteChart || [],
        monthly: res.data.monthly || [],

        recentElections: res.data.recentElections || [],
        
      });

    } catch (err) {

      console.error("Dashboard Error:", err);

    }

  };

  return (

    <div className="dashboard">

      <h1 className="dashboard-title">
        Welcome Admin 👋
      </h1>

      <p className="dashboard-subtitle">
        Secure Online Voting System Dashboard
      </p>

      {/* Statistics Cards */}

      <div className="stats-grid">

        <StatsCard
          title="Election Officers"
          value={dashboard.officers}
          icon={<FaUserShield />}
          color="#2563eb"
        />

        <StatsCard
          title="Voters"
          value={dashboard.voters}
          icon={<FaUsers />}
          color="#16a34a"
        />

        <StatsCard
          title="Candidates"
          value={dashboard.candidates}
          icon={<FaUserTie />}
          color="#f59e0b"
        />

        <StatsCard
          title="Active Elections"
          value={dashboard.activeElections}
          icon={<FaVoteYea />}
          color="#dc2626"
        />

      </div>

      {/* Quick Actions */}

     <QuickActions
    onAddOfficer={() => setShowOfficerModal(true)}
    onAddVoter={() => setShowVoterModal(true)}
    onCreateElection={() => setShowElectionModal(true)}
/>

      {/* Charts */}

      <DashboardCharts dashboard={dashboard} />

      {/* Recent Elections */}

      <RecentElections
        elections={dashboard.recentElections}
      />

    
{showOfficerModal && (
    <AddOfficerModal
        close={() => setShowOfficerModal(false)}
    />
)}

{showVoterModal && (
    <AddVoterModal
        show={showVoterModal}
        onClose={() => setShowVoterModal(false)}
    />
)}

{showElectionModal && (
    <AddElectionModal
        onClose={() => setShowElectionModal(false)}
    />
)}
    </div>

  );

}