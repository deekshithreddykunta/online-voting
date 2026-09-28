import { NavLink } from "react-router-dom";
import "./OfficerSidebar.css";

export default function OfficerSidebar() {

    return (

        <aside className="officer-sidebar">

            <div className="officer-logo">

                <h2>Election Officer</h2>

            </div>

            <nav>

                <NavLink to="/officer/dashboard">
                    <i className="fas fa-chart-line"></i>
                    Dashboard
                </NavLink>

                <NavLink to="/officer/elections">
                    <i className="fas fa-vote-yea"></i>
                    Elections
                </NavLink>

                <NavLink to="/officer/positions">
                    <i className="fas fa-list"></i>
                    Positions
                </NavLink>

                <NavLink to="/officer/candidates">
                    <i className="fas fa-user-tie"></i>
                    Candidates
                </NavLink>

                <NavLink to="/officer/voters">
                    <i className="fas fa-users"></i>
                    Voters
                </NavLink>

                <NavLink to="/officer/results">
                    <i className="fas fa-poll"></i>
                    Results
                </NavLink>

                <NavLink to="/officer/live-voting">
                    <i className="fas fa-broadcast-tower"></i>
                    Live Voting
                </NavLink>

                <NavLink to="/officer/profile">
                    <i className="fas fa-user-circle"></i>
                    Profile
                </NavLink>

                <NavLink to="/login">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </NavLink>

            </nav>

        </aside>

    );

}