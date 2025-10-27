import React, { useEffect, useState } from "react";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data. Please try again.");
        }

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!userData) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {userData.name}!</p>
      <p>Your email: {userData.email}</p>
    </div>
  );
}

export default Dashboard;
