import React, { useState, useEffect } from "react";
import { useToast, ToastContainer } from './Toast';

function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    occupation: "",
    dob: "",
    companyName: "",
    startedYear: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    timezone: "",
    currency: "INR",
    language: "en",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

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
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          currency: data.currency || "INR",
          language: data.language || "en",
          avatar: data.avatar || "",
        });
        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
        showSuccess("Profile updated successfully!");
        setHasChanges(false);
      } else {
        showError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      showError("Error updating profile. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showError("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setUserData({ ...userData, avatar: reader.result });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        showSuccess("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        showError(data.msg || "Failed to change password");
      }
    } catch (err) {
      showError("Error changing password");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateCompletion = () => {
    const fields = ['name', 'occupation', 'dob', 'phone', 'address', 'city', 'country'];
    const filled = fields.filter(f => userData[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  if (loading) return <div className="loading">Loading profile...</div>;

  const completion = calculateCompletion();

  return (
    <div className="content-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <div className="profile-completion">
          <span className="completion-text">Profile {completion}% complete</span>
          <div className="completion-bar">
            <div className="completion-fill" style={{ width: `${completion}%` }}></div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="unsaved-changes-banner">
          <span>⚠️ You have unsaved changes</span>
        </div>
      )}

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
        <button
          className={`profile-tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ Preferences
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="profile-form-enhanced">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {avatarPreview || userData.avatar ? (
                    <img src={avatarPreview || userData.avatar} alt="Profile" />
                  ) : (
                    <div className="avatar-initials">{getInitials(userData.name)}</div>
                  )}
                </div>
                <div className="avatar-upload-controls">
                  <label htmlFor="avatar-input" className="btn-secondary">
                    📷 Change Photo
                  </label>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <p className="avatar-hint">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
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
                    className="input-disabled"
                  />
                  <small className="field-hint">Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
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
              </div>
            </div>

            {/* Professional Information */}
            <div className="form-section">
              <h3 className="section-title">Professional Information</h3>
              <div className="form-grid">
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
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={userData.companyName}
                    onChange={handleChange}
                    placeholder="Your company"
                  />
                </div>

                <div className="form-group">
                  <label>Business Started Year</label>
                  <input
                    type="number"
                    name="startedYear"
                    value={userData.startedYear}
                    onChange={handleChange}
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h3 className="section-title">Address</h3>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={userData.country} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  fetchProfile();
                  setHasChanges(false);
                  showInfo("Changes discarded");
                }}
                disabled={!hasChanges || saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving || !hasChanges}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="security-section">
            <form onSubmit={handlePasswordChange} className="profile-form-enhanced">
              <div className="form-section">
                <h3 className="section-title">Change Password</h3>
                <p className="section-description">
                  Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="password-fields-container">
                  <div className="form-group password-input-group">
                    <label>Current Password *</label>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <div className="form-group password-input-group">
                    <label>New Password *</label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <div className="form-group password-input-group">
                    <label>Confirm New Password *</label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSubmit} className="profile-form-enhanced">
            <div className="form-section">
              <h3 className="section-title">Regional Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Timezone</label>
                  <select name="timezone" value={userData.timezone} onChange={handleChange}>
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="America/Los_Angeles">Los Angeles (PST)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                    <option value="Asia/Singapore">Singapore (SGT)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Currency</label>
                  <select name="currency" value={userData.currency} onChange={handleChange}>
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                    <option value="GBP">£ British Pound (GBP)</option>
                    <option value="AED">د.إ UAE Dirham (AED)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <select name="language" value={userData.language} onChange={handleChange}>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={saving || !hasChanges}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
