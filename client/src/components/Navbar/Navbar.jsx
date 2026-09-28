import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

    const navigate = useNavigate();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <nav className="navbar">

            <div className="logo">
                Secure<span>Vote</span>
            </div>

            <ul className="nav-links">
                <li><Link to="/" onClick={scrollToTop}>Home</Link></li>
                <li><Link to="/elections">Elections</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>

            <div className="nav-buttons">

                <button
                    className="login-btn"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

                <Link to="/register" className="register-btn">
                    Register
                </Link>

            </div>

        </nav>
    );
}