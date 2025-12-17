import React from 'react';

function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="confirm-dialog">
        <div className={`confirm-dialog-header confirm-${type}`}>
          <span className="confirm-icon">
            {type === 'danger' && '⚠️'}
            {type === 'warning' && '⚡'}
            {type === 'info' && 'ℹ️'}
          </span>
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button 
            className="btn-secondary" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-${type === 'danger' ? 'danger' : 'primary'}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmDialog;
