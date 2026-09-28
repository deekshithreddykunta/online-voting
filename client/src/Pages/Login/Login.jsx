import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser,getProfile } from "../../services/authService";
import "./Login.css";
import { toast } from "react-toastify";
export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
 

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

    const response = await loginUser({
      login: form.username,
      password: form.password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Test protected route
    const profile = await getProfile();
    console.log(profile.data);

    toast.success(
      response.data.message || "Login Successful!"
    );

    setTimeout(() => {

      switch (user.role_id) {

        case 1:
          navigate("/admin");
          break;

        case 2:
          navigate("/officer");
          break;

        case 3:
          navigate("/candidate");
          break;

        case 4:
          navigate("/voter");
          break;

        default:
          navigate("/");
      }

    }, 1200);

  } catch (err) {

    toast.error(
      err.response?.data?.message ||
      "Login Failed!"
    );

  } finally {

    setLoading(false);

  }
};

  return (

    <div className="login-page">

      <div className="login-left">

        <h1>SecureVote</h1>

        <h2>Welcome Back</h2>

        <p>
          Login to access India's secure online voting
          platform and cast your vote safely.
        </p>

        <ul>
          <li>✓ End-to-End Encryption</li>
          <li>✓ Blockchain Security</li>
          <li>✓ Transparent Elections</li>
          <li>✓ Instant Result Verification</li>
        </ul>

      </div>

      <div className="login-card">

        <h2>Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={form.username}
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

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember Me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        <p>
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>

    </div>
  );
}