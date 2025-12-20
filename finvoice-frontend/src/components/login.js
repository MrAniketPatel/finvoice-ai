import React, { useState } from "react";
import { API_ENDPOINTS } from "../config";

function Login({ onLoginSuccess, switchToRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend server error. Please check if the server is running.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Login failed. Please check your credentials.");
      }

      // Always store token in localStorage for consistent experience
      localStorage.setItem("token", data.token);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
      onLoginSuccess();
    } catch (err) {
      if (err.name === "SyntaxError") {
        setError("Backend connection error. Please ensure the server is running on port 5000.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>
          Sign in to continue managing your finances
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group password-input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          <div className="form-group remember-me-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        <div className="switch-auth">
          New user?{" "}
          <button onClick={switchToRegister}>Create an account</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
