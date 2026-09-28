import { FaUserCircle, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [dateTime, setDateTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = dateTime.toDateString();
  const time = dateTime.toLocaleTimeString();

  const titles = {
    "/admin": "Admin Dashboard",
    "/admin/profile": "Profile",
    "/admin/officers": "Election Officers",
    "/admin/voters": "Voters",
    "/admin/candidates": "Candidates",
    "/admin/elections": "Elections",
    "/admin/positions": "Positions",
    "/admin/results": "Results",
    "/admin/reports": "Reports",
    "/admin/settings": "Settings",
  };

  const pageTitle = titles[location.pathname] || "";

  return (
    <div className="navbar">

      <div className="navbar-title">
        <h2>{pageTitle}</h2>
      </div>

      <div className="datetime-widget">
        <div className="date-box">
          <FaCalendarAlt />
          <span>{date}</span>
        </div>

        <div className="time-box">
          <FaClock />
          <span>{time}</span>
        </div>
      </div>

      <div className="profile">
        <FaUserCircle className="profile-icon" />
        <div>
          <h4>Deekshith</h4>
          <p>Administrator</p>
        </div>
      </div>

    </div>
  );
}