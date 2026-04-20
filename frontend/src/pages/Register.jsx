import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../css/auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    emailaddress: "",
    password: "",
    phone: "",
    age: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.firstname || !formData.lastname) {
      toast.error("Please fill all fields before continuing");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(formData);
      toast.success(data.message || "Welcome to Syncora!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
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

      <div className="auth-card-wrapper register-wrapper">

        {/* Decorative side panel */}
        <div className="auth-panel auth-panel-left animate-slide-right">
          <div className="auth-panel-content">
            <i className="fa-solid fa-seedling auth-panel-icon" />
            <h3>Start Your Journey</h3>
            <p>Join thousands of women empowering their health with Syncora.</p>
            <div className="auth-steps-indicator">
              <div className={`auth-step-dot ${step >= 1 ? "active" : ""}`}>1</div>
              <div className={`auth-step-line ${step >= 2 ? "active" : ""}`} />
              <div className={`auth-step-dot ${step >= 2 ? "active" : ""}`}>2</div>
            </div>
            <p className="auth-step-label">
              {step === 1 ? "Personal Information" : "Account Details"}
            </p>
          </div>
        </div>

        <div className="auth-card animate-slide-up">

          {/* Logo / Brand */}
          <div className="auth-brand">
            <div className="auth-logo-ring">
              <i className="fa-solid fa-heart-pulse" />
            </div>
            <h2 className="auth-brand-name">Syncora</h2>
            <p className="auth-brand-tagline">Create your account</p>
          </div>

          <h1 className="auth-title">
            {step === 1 ? "Tell Us About You" : "Secure Your Account"}
          </h1>
          <p className="auth-subtitle">
            {step === 1 ? "Step 1 of 2 — Personal details" : "Step 2 of 2 — Account credentials"}
          </p>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="auth-form animate-fade-in">

              <div className="auth-field">
                <label htmlFor="username">
                  <i className="fa-solid fa-at" /> Username
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="firstname">
                    <i className="fa-solid fa-user" /> First Name
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      placeholder="First name"
                      value={formData.firstname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="lastname">
                    <i className="fa-solid fa-user" /> Last Name
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="auth-btn">
                Continue <i className="fa-solid fa-arrow-right ms-2" />
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="auth-form animate-fade-in">

              <div className="auth-field">
                <label htmlFor="emailaddress">
                  <i className="fa-solid fa-envelope" /> Email Address
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="emailaddress"
                    name="emailaddress"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.emailaddress}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">
                  <i className="fa-solid fa-lock" /> Password
                </label>
                <div className="auth-input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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

              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="phone">
                    <i className="fa-solid fa-phone" /> Mobile Number
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="age">
                    <i className="fa-solid fa-cake-candles" /> Age
                  </label>
                  <div className="auth-input-wrap">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Your age"
                      min={10}
                      max={60}
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="auth-btn-row">
                <button
                  type="button"
                  className="auth-btn-back"
                  onClick={() => setStep(1)}
                >
                  <i className="fa-solid fa-arrow-left me-2" /> Back
                </button>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user-plus me-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="auth-switch-btn">
            <i className="fa-solid fa-right-to-bracket me-2" />
            Sign In Instead
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Register;
