import React, { useState } from "react";

function Register({ onRegisterSuccess, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return "medium";
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return "strong";
    return "medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check password strength on password change
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
        setTimeout(() => {
          switchToLogin();
        }, 1500);
      } else {
        setMessage(data.msg || "Registration failed.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Join FinVoiceAI</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Start your journey to financial clarity
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group password-input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {formData.password && (
            <div className={`password-strength password-${passwordStrength}`}>
              <div className="strength-bar">
                <div className="strength-fill"></div>
              </div>
              <span className="strength-text">
                Password strength: <strong>{passwordStrength}</strong>
              </span>
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        {message && (
          <p className={message.includes("successful") ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}
        <div className="switch-auth">
          Already have an account?{" "}
          <button onClick={switchToLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
