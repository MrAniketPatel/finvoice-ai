import React, { useState } from "react";

function Login({ onLoginSuccess, switchToRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
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

      localStorage.setItem("token", data.token);
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
