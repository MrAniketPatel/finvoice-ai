import React, { useState } from "react";

function Profile() {
  const [username, setUsername] = useState("admin");

  return (
    <div>
      <h2>Profile</h2>
      <p>Username:</p>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {/* Later you can add email, password change, etc. */}
    </div>
  );
}

export default Profile;

