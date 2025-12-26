import React, { useState, useEffect } from "react";
import "./App.css";
import Landing from "./components/landing.js";
import Login from "./components/login.js";
import Register from "./components/register.js";
import Dashboard from "./components/dashboard.js";
import BalanceSheet from "./components/balancesheet.js";
import PayableAlerts from "./components/payable-alerts.js";
import Profile from "./components/profile.js";
import FloatingVoiceButton from "./components/FloatingVoiceButton.js";
import SubscriptionPage from "./components/SubscriptionPage.js";
import PrivacyPolicy from "./components/PrivacyPolicy.js";
import TermsOfService from "./components/TermsOfService.js";
import Contact from "./components/Contact.js";
import { Analytics } from "@vercel/analytics/react";
// Navigation removed - using inline navbar
import useAlerts from "./hooks/useAlerts.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [view, setView] = useState("dashboard");
  const [showRegister, setShowRegister] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [legalPage, setLegalPage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pendingCount, overdueCount, dueSoonCount, requestNotificationPermission } = useAlerts();

  // Debug logging
  useEffect(() => {
    console.log("🚀 FinVoice App Loaded");
    console.log("API URL:", process.env.REACT_APP_API_URL);
    console.log("Is Logged In:", isLoggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("token"); // Clean up old sessionStorage tokens
    setIsLoggedIn(false);
    setShowLanding(false);
  };

  const handleGetStarted = () => {
    setShowLanding(true);
    setShowRegister(true);
    setLegalPage(null);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLegalPage(null);
  };

  const handleNavigate = (page) => {
    setLegalPage(page);
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setLegalPage(null);
    setShowLanding(false);
  };

  // Request notification permission when logged in
  useEffect(() => {
    if (isLoggedIn) {
      requestNotificationPermission();
    }
  }, [isLoggedIn, requestNotificationPermission]);

  // Show legal pages
  if (legalPage) {
    return (
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-logo" onClick={handleBackToLanding} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">F</div>
            <h1>FinVoiceAI</h1>
          </div>
          <button className="nav-btn" onClick={handleBackToLanding}>
            ← Back to Home
          </button>
        </nav>
        {legalPage === 'privacy' && <PrivacyPolicy />}
        {legalPage === 'terms' && <TermsOfService />}
        {legalPage === 'contact' && <Contact />}
      </div>
    );
  }

  // Show landing page if not logged in and not on login/register
  if (!isLoggedIn && !showLanding) {
    return (
      <Landing 
        onGetStarted={handleGetStarted}
        onLogin={() => setShowLanding(true)}
        onNavigate={handleNavigate}
      />
    );
  }

  // Show login/register
  if (!isLoggedIn && showLanding) {
    return showRegister ? (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        switchToLogin={() => setShowRegister(false)}
        onBack={() => setShowLanding(false)}
      />
    ) : (
      <Login
        onLoginSuccess={handleLoginSuccess}
        switchToRegister={() => setShowRegister(true)}
        onBack={() => setShowLanding(false)}
      />
    );
  }

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
      case "subscription":
        return <SubscriptionPage />;
      default:
        return <Dashboard />;
    }
  };

  const handleRefresh = () => {
    // Trigger refresh based on current view
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon">F</div>
          <h1>FinVoiceAI</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </button>
          <button 
            className={`nav-btn ${view === "balance" ? "active" : ""}`}
            onClick={() => setView("balance")}
          >
            Balance Sheet
          </button>
          <button 
            className={`nav-btn ${view === "alerts" ? "active" : ""}`}
            onClick={() => setView("alerts")}
            style={{ position: 'relative' }}
          >
            Payable Alerts
            {pendingCount > 0 && (
              <span className="alert-badge" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: overdueCount > 0 ? '#ef4444' : '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '2px solid white',
              }}>
                {pendingCount}
              </span>
            )}
          </button>
          <button 
            className={`nav-btn ${view === "profile" ? "active" : ""}`}
            onClick={() => setView("profile")}
          >
            Profile
          </button>
          <button 
            className={`nav-btn ${view === "subscription" ? "active" : ""}`}
            onClick={() => setView("subscription")}
          >
            Upgrade
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="mobile-hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={isMobileMenuOpen ? 'active' : ''}></span>
          <span className={isMobileMenuOpen ? 'active' : ''}></span>
          <span className={isMobileMenuOpen ? 'active' : ''}></span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu">
            <button 
              className={`mobile-menu-item ${view === "dashboard" ? "active" : ""}`}
              onClick={() => { setView("dashboard"); setIsMobileMenuOpen(false); }}
            >
              📊 Dashboard
            </button>
            <button 
              className={`mobile-menu-item ${view === "balance" ? "active" : ""}`}
              onClick={() => { setView("balance"); setIsMobileMenuOpen(false); }}
            >
              💰 Balance Sheet
            </button>
            <button 
              className={`mobile-menu-item ${view === "alerts" ? "active" : ""}`}
              onClick={() => { setView("alerts"); setIsMobileMenuOpen(false); }}
            >
              🔔 Payable Alerts
              {pendingCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: overdueCount > 0 ? '#ef4444' : '#f59e0b',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
            <button 
              className={`mobile-menu-item ${view === "profile" ? "active" : ""}`}
              onClick={() => { setView("profile"); setIsMobileMenuOpen(false); }}
            >
              👤 Profile
            </button>
            <button 
              className={`mobile-menu-item ${view === "subscription" ? "active" : ""}`}
              onClick={() => { setView("subscription"); setIsMobileMenuOpen(false); }}
            >
              ⭐ Upgrade
            </button>
            <button 
              className="mobile-menu-item logout"
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            >
              🚪 Logout
            </button>
          </div>
        </>
      )}
      
      <div className="main-content-area">
        {overdueCount > 0 && (
          <div className="notification-banner" style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '12px 24px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
          }}>
            ⚠️ You have {overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}! 
            <button 
              onClick={() => setView('alerts')}
              style={{
                marginLeft: '12px',
                background: 'white',
                color: '#ef4444',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              View Now
            </button>
          </div>
        )}
        {dueSoonCount > 0 && overdueCount === 0 && (
          <div className="notification-banner" style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '12px 24px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
          }}>
            📅 {dueSoonCount} payment{dueSoonCount > 1 ? 's' : ''} due in the next 3 days
            <button 
              onClick={() => setView('alerts')}
              style={{
                marginLeft: '12px',
                background: 'white',
                color: '#f59e0b',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              View Alerts
            </button>
          </div>
        )}
        
        {renderView()}
        <FloatingVoiceButton onRefresh={handleRefresh} />
      </div>
      <Analytics />
    </div>
  );
}

export default App;
