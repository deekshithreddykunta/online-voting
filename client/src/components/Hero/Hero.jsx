import heroImage from "../../assets/hero-voting.png";
import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <span className="hero-badge">
          🔒 SECURE • TRANSPARENT • TRUSTED
        </span>

        <h1>
          Secure Digital
          <br />
          <span>Voting</span> Platform
        </h1>

        <p>
          Experience the future of democracy with our blockchain-powered
          voting platform. Secure, transparent, and accessible for everyone.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Start Voting
          </Link>

          
        </div>

      </div>

      <div className="hero-right">
        <img src={heroImage} alt="Voting" />
      </div>

    </section>
  );
}