import React, { useState } from 'react';

function Sidebar({ view, setView, onLogout, pendingCount, overdueCount, userName }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'balance', icon: '💰', label: 'Balance Sheet' },
    { id: 'alerts', icon: '🔔', label: 'Alerts', badge: pendingCount },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  const handleMenuClick = (itemId) => {
    setView(itemId);
    setIsOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
          border: 'none',
          borderRadius: '12px',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(27, 38, 59, 0.3)',
          transition: 'all 0.3s',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            width: '24px',
            height: '3px',
            background: 'white',
            borderRadius: '2px',
            transition: 'all 0.3s',
            transform: isOpen ? 'rotate(45deg) translateY(8px)' : 'none',
          }}></span>
          <span style={{
            width: '24px',
            height: '3px',
            background: 'white',
            borderRadius: '2px',
            transition: 'all 0.3s',
            opacity: isOpen ? 0 : 1,
          }}></span>
          <span style={{
            width: '24px',
            height: '3px',
            background: 'white',
            borderRadius: '2px',
            transition: 'all 0.3s',
            transform: isOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
          }}></span>
        </div>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none',
          }}
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '280px',
          background: 'linear-gradient(180deg, var(--navy) 0%, #0f1729 100%)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Logo & User */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            💼 FinVoice.AI
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            margin: 0,
          }}>
            Welcome, {userName}
          </p>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`sidebar-item ${view === item.id ? 'active' : ''}`}
              style={{
                width: '100%',
                padding: '14px 16px',
                marginBottom: '8px',
                background: view === item.id
                  ? 'linear-gradient(135deg, var(--teal) 0%, var(--soft-green) 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: view === item.id ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                position: 'relative',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{
                  background: overdueCount > 0 ? '#ef4444' : '#f59e0b',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  minWidth: '24px',
                  textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
            e.target.style.borderColor = '#ef4444';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <span style={{ fontSize: '20px' }}>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          
          .sidebar {
            transform: translateX(-100%);
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .sidebar-overlay {
            display: block !important;
          }
        }

        .sidebar-item:hover {
          background: ${view === 'active' ? '' : 'rgba(255, 255, 255, 0.1)'} !important;
        }
      `}</style>
    </>
  );
}

export default Sidebar;
