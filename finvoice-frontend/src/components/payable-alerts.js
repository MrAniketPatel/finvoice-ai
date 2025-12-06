import React, { useEffect, useState } from "react";
import PaymentConfirmModal from "./PaymentConfirmModal";

function PayableAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "",
  });
  const [selectedAlert, setSelectedAlert] = useState(null);

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

  const handleMarkAsPaid = (id) => {
    const alert = alerts.find(a => a._id === id);
    if (alert) {
      setSelectedAlert(alert);
    }
  };

  const handleConfirmPayment = async (addAsExpense) => {
    if (!selectedAlert) return;

    try {
      const token = localStorage.getItem("token");

      // Mark alert as paid
      const res = await fetch(`http://localhost:5000/api/alerts/${selectedAlert._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "paid" }),
      });

      if (res.ok) {
        // If user confirmed, add as expense transaction
        if (addAsExpense) {
          await fetch("http://localhost:5000/api/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: "expense",
              amount: selectedAlert.amount,
              category: selectedAlert.category,
              description: `Payment: ${selectedAlert.title}`,
              date: new Date().toISOString(),
            }),
          });
        }
        
        setSelectedAlert(null);
        fetchAlerts();
      }
    } catch (err) {
      console.error("Error updating alert:", err);
      setSelectedAlert(null);
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

  const now = new Date();
  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const paidAlerts = alerts.filter((a) => a.status === "paid");
  
  // Separate overdue and upcoming
  const overdueAlerts = pendingAlerts.filter((a) => new Date(a.dueDate) < now);
  const upcomingAlerts = pendingAlerts.filter((a) => new Date(a.dueDate) >= now);

  return (
    <div className="content-container">
      <PaymentConfirmModal
        alert={selectedAlert}
        onConfirm={handleConfirmPayment}
        onCancel={() => setSelectedAlert(null)}
      />
      
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

      {overdueAlerts.length > 0 && (
        <div className="section" style={{ borderColor: '#ef4444', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, var(--white) 100%)' }}>
          <h3 style={{ color: '#ef4444', borderBottomColor: '#ef4444' }}>
            ⚠️ Overdue Payments ({overdueAlerts.length})
          </h3>
          <ul className="alert-list">
            {overdueAlerts.map((alert) => {
              const daysOverdue = Math.floor((now - new Date(alert.dueDate)) / (1000 * 60 * 60 * 24));
              return (
                <li key={alert._id} className="alert-item pending" style={{ borderLeftColor: '#ef4444', borderLeftWidth: '5px' }}>
                  <div>
                    <strong>{alert.title}</strong>
                    <p style={{ fontSize: "12px", color: "#ef4444", margin: "5px 0 0 0", fontWeight: '600' }}>
                      {alert.category} • Overdue by {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div>
                      <strong style={{ color: '#ef4444' }}>₹{alert.amount}</strong>
                      <p style={{ fontSize: "12px", color: "#ef4444", margin: "5px 0 0 0", fontWeight: '600' }}>
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
              );
            })}
          </ul>
        </div>
      )}

      <div className="section">
        <h3>Upcoming Payments ({upcomingAlerts.length})</h3>
        {upcomingAlerts.length > 0 ? (
          <ul className="alert-list">
            {upcomingAlerts.map((alert) => {
              const daysUntil = Math.ceil((new Date(alert.dueDate) - now) / (1000 * 60 * 60 * 24));
              const isDueSoon = daysUntil <= 3;
              return (
                <li key={alert._id} className="alert-item pending" style={isDueSoon ? { borderLeftColor: '#f59e0b', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, var(--white) 100%)' } : {}}>
                  <div>
                    <strong>{alert.title}</strong>
                    <p style={{ fontSize: "12px", color: isDueSoon ? "#f59e0b" : "#666", margin: "5px 0 0 0", fontWeight: isDueSoon ? '600' : 'normal' }}>
                      {alert.category} {isDueSoon && `• Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div>
                      <strong style={{ color: isDueSoon ? '#f59e0b' : 'inherit' }}>₹{alert.amount}</strong>
                      <p style={{ fontSize: "12px", color: isDueSoon ? "#f59e0b" : "#666", margin: "5px 0 0 0" }}>
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
              );
            })}
          </ul>
        ) : (
          <p>No upcoming payments. You're all caught up!</p>
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
