import React, { useEffect, useState } from "react";

function BalanceSheet() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/balancesheet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.msg || "Failed to fetch");

        setData(result);
      } catch (err) {
        console.error("BalanceSheet error:", err);
        setError(err.message);
      }
    };

    fetchBalance();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Loading balance sheet...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Balance Sheet Summary</h2>
      <p><strong>Total Income:</strong> ₹{data.totalIncome}</p>
      <p><strong>Total Expense:</strong> ₹{data.totalExpense}</p>
      <p><strong>Profit:</strong> ₹{data.profit}</p>
    </div>
  );
}

export default BalanceSheet;
