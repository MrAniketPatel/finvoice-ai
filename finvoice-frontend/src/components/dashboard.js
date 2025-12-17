import React, { useEffect, useState } from "react";
import VoiceAssistant from "./VoiceAssistant";
import AIInsights from "./AIInsights";
import { API_ENDPOINTS } from "../config";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.DASHBOARD, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data.");
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="content-container">
        <p className="error-msg">{error}</p>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h2>Welcome back, {data?.user?.name}</h2>
      <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
        Here's your financial overview at a glance
      </p>
      
      <VoiceAssistant onRefresh={fetchDashboardData} />
      
      {/* AI Insights */}
      {console.log("Dashboard data:", data)}
      {console.log("Transactions for AI:", data?.transactions || data?.recentTransactions)}
      <AIInsights transactions={data?.transactions || data?.recentTransactions || []} />
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Income</h3>
          <p>₹{data?.stats?.totalIncome || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expense</h3>
          <p>₹{data?.stats?.totalExpense || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Balance</h3>
          <p>₹{data?.stats?.balance || 0}</p>
        </div>
      </div>

      <div className="section">
        <h3>Recent Transactions</h3>
        {data?.recentTransactions?.length > 0 ? (
          <ul className="transaction-list">
            {data.recentTransactions.map((transaction) => (
              <li key={transaction._id} className={`transaction-item ${transaction.type}`}>
                <div>
                  <strong>{transaction.category}</strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    {transaction.description}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ color: transaction.type === "income" ? "#27ae60" : "#e74c3c" }}>
                    {transaction.type === "income" ? "+" : "-"}₹{transaction.amount}
                  </strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions yet. Start adding your income and expenses!</p>
        )}
      </div>

      <div className="section">
        <h3>Upcoming Payments</h3>
        {data?.pendingAlerts?.length > 0 ? (
          <ul className="alert-list">
            {data.pendingAlerts.map((alert) => (
              <li key={alert._id} className="alert-item pending">
                <div>
                  <strong>{alert.title}</strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    {alert.category}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>₹{alert.amount}</strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    Due: {new Date(alert.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending payments. You're all caught up!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
