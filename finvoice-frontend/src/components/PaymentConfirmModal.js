import React from 'react';

function PaymentConfirmModal({ alert, onConfirm, onCancel }) {
  if (!alert) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s',
    }}>
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s',
      }}>
        <h3 style={{ 
          color: 'var(--navy)', 
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '700',
        }}>
          Mark Payment as Paid?
        </h3>

        <div style={{
          background: 'var(--gray-50)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid var(--teal)',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: 'var(--navy)' }}>Payment:</strong>
            <p style={{ margin: '4px 0', fontSize: '18px', fontWeight: '600' }}>
              {alert.title}
            </p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: 'var(--navy)' }}>Amount:</strong>
            <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '700', color: 'var(--teal)' }}>
              ₹{alert.amount}
            </p>
          </div>
          <div>
            <strong style={{ color: 'var(--navy)' }}>Category:</strong>
            <p style={{ margin: '4px 0' }}>{alert.category}</p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(27, 38, 59, 0.05) 0%, rgba(113, 199, 184, 0.05) 100%)',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid var(--gray-200)',
        }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: 'var(--navy)' }}>
            ✨ This will automatically:
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--gray-700)' }}>
            <li>Mark this alert as paid</li>
            <li>Add ₹{alert.amount} as an expense transaction</li>
            <li>Update your balance sheet</li>
            <li>Track this payment in your history</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onConfirm(true)}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            ✓ Confirm & Add Expense
          </button>
          <button
            onClick={() => onConfirm(false)}
            style={{
              flex: 1,
              padding: '14px',
              background: 'white',
              color: 'var(--navy)',
              border: '2px solid var(--navy)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--gray-50)'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            Mark Paid Only
          </button>
        </div>

        <button
          onClick={onCancel}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '12px',
            background: 'transparent',
            color: 'var(--gray-600)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default PaymentConfirmModal;
