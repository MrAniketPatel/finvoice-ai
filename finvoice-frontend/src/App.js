import React, { useState } from "react";
import "./App.css";
import Landing from "./components/landing.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Dashboard from "./components/dashboard.js";
import BalanceSheet from "./components/balancesheet.js";
import PayableAlerts from "./components/payable-alerts.js";
import Profile from "./components/profile.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [view, setView] = useState("dashboard");
  const [showRegister, setShowRegister] = useState(false);
  const [showLanding, setShowLanding] = useState(!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowLanding(true);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  if (showLanding && !isLoggedIn) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  if (!isLoggedIn) {
    return showRegister ? (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        switchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLoginSuccess={() => setIsLoggedIn(true)}
        switchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "balance":
        return <BalanceSheet />;
      case "alerts":
        return <PayableAlerts />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>💼 FinVoice.AI</h1>
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${view === "balance" ? "active" : ""}`}
            onClick={() => setView("balance")}
          >
            Balance Sheet
          </button>
          <button 
            className={`nav-btn ${view === "alerts" ? "active" : ""}`}
            onClick={() => setView("alerts")}
          >
            Payable Alerts
          </button>
          <button 
            className={`nav-btn ${view === "profile" ? "active" : ""}`}
            onClick={() => setView("profile")}
          >
            Profile
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      {renderView()}
    </div>
  );
}

export default App;
