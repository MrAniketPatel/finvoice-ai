import React, { useState, useEffect } from "react";

function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    occupation: "",
    dob: "",
    companyName: "",
    startedYear: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUserData({
          name: data.name || "",
          email: data.email || "",
          occupation: data.occupation || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          companyName: data.companyName || "",
          startedYear: data.startedYear || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      setMessage("Error updating profile.");
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="content-container">
      <h2>Your Profile</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled
            style={{ background: "#f0f0f0", cursor: "not-allowed" }}
          />
        </div>

        <div className="form-group">
          <label>Occupation</label>
          <select name="occupation" value={userData.occupation} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Student">Student</option>
            <option value="Employee">Employee</option>
            <option value="Business Owner">Business Owner</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Company Name (if applicable)</label>
          <input
            type="text"
            name="companyName"
            value={userData.companyName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Business Started Year (if applicable)</label>
          <input
            type="number"
            name="startedYear"
            value={userData.startedYear}
            onChange={handleChange}
            placeholder="e.g., 2020"
          />
        </div>

        <button type="submit" className="btn-primary">
          Update Profile
        </button>

        {message && (
          <p className={message.includes("success") ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Profile;
