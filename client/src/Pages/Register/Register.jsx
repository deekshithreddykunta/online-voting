import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";
import { toast } from "react-toastify";
export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "Voter",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await registerUser(form);

    toast.success(
      res.data?.message || "Registration successful! Redirecting to Login..."
    );

    // Clear form
    setForm({
      full_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "Voter",
    });

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (err) {

    toast.error(
      err.response?.data?.message || "Registration failed!"
    );

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="register-page">

      {/* Left Section */}

      <div className="register-left">

        <h1>SecureVote</h1>

        <h2>Create Your Account</h2>

        <p>
          Join India's secure online voting platform.
          Register once and vote safely from anywhere.
        </p>

        <ul>
          <li>✔ Secure Authentication</li>
          <li>✔ End-to-End Encryption</li>
          <li>✔ Transparent Elections</li>
          <li>✔ Instant Result Verification</li>
        </ul>

      </div>

      {/* Right Section */}

      <div className="register-card">

        <h2>Register</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="Voter">Voter</option>
            <option value="Candidate">Candidate</option>
          </select>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {message && (
            <div
              className={
                message.includes("Successful")
                  ? "success-message"
                  : "error-message"
              }
            >
              {message}
            </div>
          )}

          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>

        </form>

      </div>

    </div>
  );
}