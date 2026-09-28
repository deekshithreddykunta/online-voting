import {
    FaTachometerAlt,
    FaUser,
    FaVoteYea,
    FaClipboardList,
    FaSignOutAlt,
    FaPoll
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

import "./CandidateSidebar.css";

export default function CandidateSidebar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };

    return (

        <div className="candidate-sidebar">

            <div className="sidebar-top">

                <div className="logo">
                    SecureVote
                </div>

                <nav>

                    <NavLink to="/candidate" end>
                        <FaTachometerAlt />
                        Dashboard
                    </NavLink>

                    <NavLink to="/candidate/profile">
                        <FaUser />
                        My Profile
                    </NavLink>

                    <NavLink to="/candidate/elections">
                        <FaVoteYea />
                        Available Elections
                    </NavLink>

                    <NavLink to="/candidate/my-nominations">
                        <FaClipboardList />
                        My Nominations
                    </NavLink>

                    <NavLink to="/candidate/results">
                        <FaPoll />
                        Results
                    </NavLink>

                </nav>

            </div>

            <button
                className="logout-btn"
                onClick={handleLogout}
            >
                <FaSignOutAlt />
                Logout
            </button>

        </div>

    );

}