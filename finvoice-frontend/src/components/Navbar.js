import React, { useState } from 'react';

function Navbar({ view, setView, onLogout, pendingCount, overdueCount, userName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'balance', icon: '💰', label: 'Balance Sheet' },
    { id: 'alerts', icon: '🔔', label: 'Alerts', badge: pendingCount },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const handleMenuClick = (itemId) => {
    setView(itemId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="modern-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <h1>💼 FinVoice.AI</h1>
          </div>

          {/* Desktop Menu */}
          <div className="navbar-menu-desktop">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`nav-item ${view === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className={`nav-badge ${overdueCount > 0 ? 'danger' : 'warning'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User & Logout */}
          <div className="navbar-actions">
            <span className="navbar-user">Hi, {userName}</span>
            <button onClick={onLogout} className="navbar-logout">
              Logout
            </button>
          </div>

          {/* Hamburger Button */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={isMenuOpen ? 'active' : ''}></span>
            <span className={isMenuOpen ? 'active' : ''}></span>
            <span className={isMenuOpen ? 'active' : ''}></span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-user">
            <span>👋 Hi, {userName}</span>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`mobile-menu-item ${view === item.id ? 'active' : ''}`}
            >
              <span className="mobile-icon">{item.icon}</span>
              <span className="mobile-label">{item.label}</span>
              {item.badge > 0 && (
                <span className={`mobile-badge ${overdueCount > 0 ? 'danger' : 'warning'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button onClick={onLogout} className="mobile-menu-logout">
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      <style>{`
        .modern-navbar {
          background: linear-gradient(135deg, var(--navy) 0%, #0f1729 100%);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .navbar-logo h1 {
          color: white;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .navbar-menu-desktop {
          display: flex;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: var(--teal);
          color: white;
          font-weight: 600;
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: #ef4444;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 700;
          min-width: 18px;
          text-align: center;
        }

        .nav-badge.warning {
          background: #f59e0b;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navbar-user {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
        }

        .navbar-logout {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .navbar-logout:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger span {
          width: 24px;
          height: 3px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .hamburger span.active:nth-child(1) {
          transform: rotate(45deg) translateY(8px);
        }

        .hamburger span.active:nth-child(2) {
          opacity: 0;
        }

        .hamburger span.active:nth-child(3) {
          transform: rotate(-45deg) translateY(-8px);
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          background: white;
          border-top: 1px solid var(--gray-200);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-menu.open {
          max-height: 500px;
        }

        .mobile-menu-user {
          padding: 16px 24px;
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-200);
          color: var(--navy);
          font-weight: 600;
        }

        .mobile-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 24px;
          background: white;
          border: none;
          border-bottom: 1px solid var(--gray-100);
          color: var(--gray-700);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          text-align: left;
        }

        .mobile-menu-item:hover {
          background: var(--gray-50);
        }

        .mobile-menu-item.active {
          background: linear-gradient(90deg, rgba(113, 199, 184, 0.1) 0%, white 100%);
          color: var(--navy);
          font-weight: 600;
          border-left: 4px solid var(--teal);
        }

        .mobile-icon {
          font-size: 20px;
        }

        .mobile-label {
          flex: 1;
        }

        .mobile-badge {
          background: #ef4444;
          color: white;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }

        .mobile-badge.warning {
          background: #f59e0b;
        }

        .mobile-menu-logout {
          width: 100%;
          padding: 14px 24px;
          background: white;
          border: none;
          color: #ef4444;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .mobile-menu-logout:hover {
          background: #fee2e2;
        }

        .menu-overlay {
          display: none;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .navbar-menu-desktop,
          .navbar-actions {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }

          .menu-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
