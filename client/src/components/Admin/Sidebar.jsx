import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUsers,
  FaUserTie,
  FaVoteYea,
  FaListAlt,
  FaChartBar,
  FaSignOutAlt,
  FaIdBadge,
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="sidebar">

      <div className="logo">
        <h2>SecureVote</h2>
      </div>

      <ul className="sidebar-menu">

        <li>
          <NavLink to="/admin">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/profile">
            <FaIdBadge />
            <span>Profile</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/officers">
            <FaUserShield />
            <span>Election Officers</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/voters">
            <FaUsers />
            <span>Voters</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/candidates">
            <FaUserTie />
            <span>Candidates</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/elections">
            <FaVoteYea />
            <span>Elections</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/positions">
            <FaListAlt />
            <span>Positions</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/results">
            <FaChartBar />
            <span>Results</span>
          </NavLink>
        </li>

      </ul>

      <div className="sidebar-logout">

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </div>

  );

}