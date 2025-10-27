import React, { useState } from "react";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

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
    <div>
      <nav style={{ marginBottom: "20px" }}>
        <button onClick={() => setView("dashboard")}>Dashboard</button>
        <button onClick={() => setView("balance")}>Balance Sheet</button>
        <button onClick={() => setView("alerts")}>Payable Alerts</button>
        <button onClick={() => setView("profile")}>Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      {renderView()}
    </div>
  );
}

export default App;
