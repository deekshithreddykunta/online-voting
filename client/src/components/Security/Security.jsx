import { FaLock, FaUserShield, FaVoteYea } from "react-icons/fa";
import "./Security.css";

export default function Security() {
  return (
    <section className="security">

      <div className="title">
        <span>Security First</span>
        <h2>Advanced Election Security</h2>
        <p>
          Our platform uses modern security technologies to ensure every vote
          remains confidential, authentic, and tamper-proof.
        </p>
      </div>

      <div className="cards">

        <div className="card">
          <FaLock className="icon" />
          <h3>End-to-End Encryption</h3>
          <p>
            Every vote is encrypted before transmission and remains protected
            throughout the election.
          </p>
        </div>

        <div className="card">
          <FaUserShield className="icon" />
          <h3>Identity Verification</h3>
          <p>
            Secure authentication ensures only eligible voters can participate.
          </p>
        </div>

        <div className="card">
          <FaVoteYea className="icon" />
          <h3>Vote Integrity</h3>
          <p>
            Every ballot is securely stored and verified without revealing voter
            identity.
          </p>
        </div>

      </div>

    </section>
  );
}