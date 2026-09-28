import {
    FaTachometerAlt,
    FaUser,
    FaVoteYea,
    FaClipboardList,
    FaPoll,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

};
    return (
        <div className="voter-sidebar">

            <div className="logo">
                SecureVote
            </div>

            <nav>

                <NavLink to="/voter">
                    <FaTachometerAlt />
                    Dashboard
                </NavLink>

                <NavLink to="/voter/profile">
                    <FaUser />
                    My Profile
                </NavLink>

                <NavLink to="/voter/available-elections">
                    <FaVoteYea />
                    Available Elections
                </NavLink>

                <NavLink to="/voter/my-votes">
                    <FaClipboardList />
                    My Votes
                </NavLink>

                <NavLink to="/voter/results">
                    <FaPoll />
                    Results
                </NavLink>

            </nav>

            <button
    className="logout-btn"
    onClick={handleLogout}
>
    Logout
</button>

        </div>
    );
}