import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../css/auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ username, password });
      toast.success(data.message || "Welcome back to Syncora!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card-wrapper">
        <div className="auth-card animate-slide-up">

          {/* Logo / Brand */}
          <div className="auth-brand">
            <div className="auth-logo-ring">
              <i className="fa-solid fa-heart-pulse" />
            </div>
            <h2 className="auth-brand-name">Syncora</h2>
            <p className="auth-brand-tagline">Your menstrual health companion</p>
          </div>

          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue your wellness journey</p>

          <form onSubmit={handleSubmit} className="auth-form">

            {/* Username */}
            <div className="auth-field">
              <label htmlFor="username">
                <i className="fa-solid fa-user" /> Username
              </label>
              <div className="auth-input-wrap">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="password">
                <i className="fa-solid fa-lock" /> Password
              </label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket me-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Don&apos;t have an account?</span>
          </div>

          <Link to="/register" className="auth-switch-btn">
            <i className="fa-solid fa-user-plus me-2" />
            Create Account
          </Link>

        </div>

        {/* Decorative side panel */}
        <div className="auth-panel animate-slide-left">
          <div className="auth-panel-content">
            <i className="fa-solid fa-venus auth-panel-icon" />
            <h3>Take Control of Your Health</h3>
            <ul className="auth-panel-list">
              <li><i className="fa-solid fa-check-circle" /> Track your cycle accurately</li>
              <li><i className="fa-solid fa-check-circle" /> Get symptom-based solutions</li>
              <li><i className="fa-solid fa-check-circle" /> Access health education</li>
              <li><i className="fa-solid fa-check-circle" /> Connect with community</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
