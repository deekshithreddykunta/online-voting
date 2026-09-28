import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Left */}

        <div className="footer-about">

          <h2>
            Secure<span>Vote</span>
          </h2>

          <p>
            SecureVote is a modern online voting platform designed to provide
            transparent, secure, and trusted digital elections with advanced
            encryption and real-time vote integrity.
          </p>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaGithub /></a>
          </div>

        </div>

        {/* Quick Links */}

        <div className="footer-links">

          <h3>Quick Links</h3>

          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/elections">Elections</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/login">Login</a></li>
          </ul>

        </div>

        {/* Services */}

        <div className="footer-links">

          <h3>Services</h3>

          <ul>
            <li>Online Voting</li>
            <li>Election Management</li>
            <li>Voter Verification</li>
            <li>Result Publishing</li>
            <li>Admin Dashboard</li>
          </ul>

        </div>

        {/* Contact */}

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt />
           Hyderabad,Telangana
          </p>

          <p>
            <FaEnvelope />
            support@securevote.com
          </p>

          <p>
            <FaPhoneAlt />
            +91 98765 43210
          </p>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SecureVote. All Rights Reserved.
      </div>

    </footer>
  );
}