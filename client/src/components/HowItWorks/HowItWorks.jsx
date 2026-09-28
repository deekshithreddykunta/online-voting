import "./HowItWorks.css";
import { FaUserCheck, FaVoteYea, FaChartBar } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="how-section">

      <div className="how-header">
        <span>How It Works</span>
        <h2>Vote in Three Simple Steps</h2>
        <p>
          Our secure voting platform makes participating in elections
          simple, transparent, and secure.
        </p>
      </div>

      <div className="timeline">

        <div className="step-card">
          <div className="icon-circle">
            <FaUserCheck />
          </div>

          <h3>Register & Verify</h3>

          <p>
            Create your account and complete identity verification
            before participating in elections.
          </p>
        </div>

        <div className="arrow">➜</div>

        <div className="step-card">

          <div className="icon-circle">
            <FaVoteYea />
          </div>

          <h3>Cast Your Vote</h3>

          <p>
            Choose your preferred candidate and securely submit your vote.
          </p>

        </div>

        <div className="arrow">➜</div>

        <div className="step-card">

          <div className="icon-circle">
            <FaChartBar />
          </div>

          <h3>View Results</h3>

          <p>
            Watch verified election results published in real time with
            complete transparency.
          </p>

        </div>

      </div>

    </section>
  );
}