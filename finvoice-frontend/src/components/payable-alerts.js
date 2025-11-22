import React, { useEffect, useState } from "react";

function PayableAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "",
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) setAlerts(result);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAlert),
      });

      if (res.ok) {
        setNewAlert({
          title: "",
          amount: "",
          dueDate: "",
          category: "",
        });
        fetchAlerts();
      }
    } catch (err) {
      console.error("Error adding alert:", err);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "paid" }),
      });

      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error("Error updating alert:", err);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) fetchAlerts();
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  if (loading) return <div className="loading">Loading alerts...</div>;

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const paidAlerts = alerts.filter((a) => a.status === "paid");

  return (
    <div className="content-container">
      <h2>Payable Alerts</h2>

      <div className="add-form">
        <h3>Add New Alert</h3>
        <form onSubmit={handleAddAlert}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Title (e.g., Rent Payment)"
              value={newAlert.title}
              onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={newAlert.amount}
              onChange={(e) => setNewAlert({ ...newAlert, amount: e.target.value })}
              required
            />
            <input
              type="date"
              value={newAlert.dueDate}
              onChange={(e) => setNewAlert({ ...newAlert, dueDate: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Category (e.g., Rent, Loan)"
              value={newAlert.category}
              onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-secondary">Add Alert</button>
        </form>
      </div>

      <div className="section">
        <h3>Pending Payments ({pendingAlerts.length})</h3>
        {pendingAlerts.length > 0 ? (
          <ul className="alert-list">
            {pendingAlerts.map((alert) => (
              <li key={alert._id} className="alert-item pending">
                <div>
                  <strong>{alert.title}</strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    {alert.category}
                  </p>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div>
                    <strong>₹{alert.amount}</strong>
                    <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                      Due: {new Date(alert.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="btn-success"
                    onClick={() => handleMarkAsPaid(alert._id)}
                  >
                    Mark Paid
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteAlert(alert._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending payments. Great job!</p>
        )}
      </div>

      <div className="section">
        <h3>Paid ({paidAlerts.length})</h3>
        {paidAlerts.length > 0 ? (
          <ul className="alert-list">
            {paidAlerts.map((alert) => (
              <li key={alert._id} className="alert-item paid">
                <div>
                  <strong>{alert.title}</strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    {alert.category}
                  </p>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div>
                    <strong>₹{alert.amount}</strong>
                    <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                      Paid on: {new Date(alert.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteAlert(alert._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No paid alerts yet.</p>
        )}
      </div>
    </div>
  );
}

export default PayableAlerts;
