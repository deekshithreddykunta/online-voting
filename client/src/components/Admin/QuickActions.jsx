import {
  FaUserPlus,
  FaUsers,
  FaVoteYea,
  FaChartBar,
} from "react-icons/fa";

import "./QuickActions.css";
import { useNavigate } from "react-router-dom";
export default function QuickActions({
  onAddOfficer,
  onAddVoter,
  onCreateElection,
}) {
const navigate = useNavigate();
  return (

    <div className="quick-actions">

      <h2>Quick Actions</h2>

      <div className="actions-grid">

        <button
          className="action-card"
          onClick={onAddOfficer}
        >
          <FaUserPlus />
          <span>Add Officer</span>
        </button>

        <button
          className="action-card"
          onClick={onAddVoter}
        >
          <FaUsers />
          <span>Add Voter</span>
        </button>

        <button
          className="action-card"
          onClick={onCreateElection}
        >
          <FaVoteYea />
          <span>Create Election</span>
        </button>

       <button
    className="action-card"
    onClick={() => navigate("/admin/results")}
>
    <FaChartBar />
    <span>View Results</span>
</button>
          

      </div>

    </div>

  );

}