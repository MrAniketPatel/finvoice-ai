import React, { useEffect, useState } from "react";
import { suggestCategory } from "../utils/aiInsights";

function BalanceSheet() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    amount: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/balancesheet?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.msg || "Failed to fetch");

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) setTransactions(result);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTransaction),
      });

      if (res.ok) {
        setNewTransaction({
          type: "income",
          amount: "",
          category: "",
          description: "",
        });
        fetchBalance();
        fetchTransactions();
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchBalance();
        fetchTransactions();
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  if (loading) return <div className="loading">Loading balance sheet...</div>;
  if (error) return <div className="content-container"><p className="error-msg">{error}</p></div>;

  return (
    <div className="content-container">
      <h2>Balance Sheet</h2>

      <div className="add-form">
        <h3>Add Transaction</h3>
        <form onSubmit={handleAddTransaction}>
          <div className="form-row">
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              required
              min="0"
              step="0.01"
              onKeyPress={(e) => {
                // Only allow numbers and decimal point
                if (!/[0-9.]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              type="text"
              placeholder="Category (e.g., Salary, Food)"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTransaction.description}
              onChange={(e) => {
                const desc = e.target.value;
                setNewTransaction({ ...newTransaction, description: desc });
                // Auto-suggest category based on description
                if (desc.length > 3 && !newTransaction.category) {
                  const suggested = suggestCategory(desc);
                  if (suggested !== "Other") {
                    setNewTransaction({ ...newTransaction, description: desc, category: suggested });
                  }
                }
              }}
            />
          </div>
          <button type="submit" className="btn-secondary">Add Transaction</button>
        </form>
      </div>

      <div className="period-selector">
        <button
          className={`period-btn ${period === "week" ? "active" : ""}`}
          onClick={() => setPeriod("week")}
        >
          1 Week
        </button>
        <button
          className={`period-btn ${period === "month" ? "active" : ""}`}
          onClick={() => setPeriod("month")}
        >
          1 Month
        </button>
        <button
          className={`period-btn ${period === "6months" ? "active" : ""}`}
          onClick={() => setPeriod("6months")}
        >
          6 Months
        </button>
        <button
          className={`period-btn ${period === "year" ? "active" : ""}`}
          onClick={() => setPeriod("year")}
        >
          1 Year
        </button>
        <button
          className={`period-btn ${period === "all" ? "active" : ""}`}
          onClick={() => setPeriod("all")}
        >
          All Time
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Income</h3>
          <p>₹{data?.totalIncome || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expense</h3>
          <p>₹{data?.totalExpense || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Profit/Loss</h3>
          <p style={{ color: data?.profit >= 0 ? "#fff" : "#ffcccc" }}>
            ₹{data?.profit || 0}
          </p>
        </div>
      </div>

      <div className="section">
        <h3>All Transactions</h3>
        {transactions.length > 0 ? (
          <ul className="transaction-list">
            {transactions.map((transaction) => (
              <li key={transaction._id} className={`transaction-item ${transaction.type}`}>
                <div>
                  <strong>{transaction.category}</strong>
                  <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                    {transaction.description}
                  </p>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div>
                    <strong style={{ color: transaction.type === "income" ? "#27ae60" : "#e74c3c" }}>
                      {transaction.type === "income" ? "+" : "-"}₹{transaction.amount}
                    </strong>
                    <p style={{ fontSize: "12px", color: "#666", margin: "5px 0 0 0" }}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteTransaction(transaction._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found for this period.</p>
        )}
      </div>
    </div>
  );
}

export default BalanceSheet;
