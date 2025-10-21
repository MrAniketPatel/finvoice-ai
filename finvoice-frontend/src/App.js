import React, { useState } from "react";
import Login from "./components/login.js";
import Dashboard from "./components/dashboard.js";
import BalanceSheet from "./components/balancesheet.js";
import PayableAlerts from "./components/payable-alerts.js";
import Profile from "./components/profile.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard"); // options: dashboard, balance, alerts, profile

  if (!isLoggedIn) {
    // Show login page if not logged in
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Render selected view after login
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
      </nav>
      {renderView()}
    </div>
  );
}

export default App;

