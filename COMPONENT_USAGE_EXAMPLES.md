# Component Usage Examples

## 🎯 How to Use New QoL Components

### 1. ConfirmDialog Component

**Purpose**: Show confirmation before destructive actions (delete, logout, etc.)

**Basic Usage:**
```javascript
import React, { useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog';

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    // Your delete logic here
    console.log('Item deleted!');
  };

  return (
    <>
      <button onClick={() => setShowConfirm(true)}>
        Delete Transaction
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}
```

**Props:**
- `isOpen` (boolean): Show/hide dialog
- `onClose` (function): Called when canceled
- `onConfirm` (function): Called when confirmed
- `title` (string): Dialog title
- `message` (string): Dialog message
- `confirmText` (string): Confirm button text
- `cancelText` (string): Cancel button text
- `type` (string): 'danger', 'warning', or 'info'

**Examples:**

```javascript
// Delete confirmation
<ConfirmDialog
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={deleteTransaction}
  title="Delete Transaction"
  message="This will permanently delete the transaction."
  type="danger"
/>

// Logout confirmation
<ConfirmDialog
  isOpen={showLogout}
  onClose={() => setShowLogout(false)}
  onConfirm={handleLogout}
  title="Logout"
  message="Are you sure you want to logout?"
  confirmText="Logout"
  type="warning"
/>

// Info confirmation
<ConfirmDialog
  isOpen={showInfo}
  onClose={() => setShowInfo(false)}
  onConfirm={handleAction}
  title="Upgrade Plan"
  message="You're about to upgrade to Premium. Continue?"
  confirmText="Upgrade"
  type="info"
/>
```

---

### 2. Toast Notifications

**Purpose**: Show temporary success/error/info messages

**Setup in App.js:**
```javascript
import React from 'react';
import { useToast, ToastContainer } from './components/Toast';

function App() {
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();

  // Example usage
  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Transaction saved successfully!');
    } catch (error) {
      showError('Failed to save transaction. Please try again.');
    }
  };

  return (
    <div className="app">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Your app content */}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

**Methods:**
- `showSuccess(message, title)` - Green toast
- `showError(message, title)` - Red toast
- `showWarning(message, title)` - Orange toast
- `showInfo(message, title)` - Blue toast

**Examples:**

```javascript
// Success
showSuccess('Transaction added successfully!');
showSuccess('Your changes have been saved.', 'Saved');

// Error
showError('Failed to connect to server.');
showError('Invalid email address.', 'Validation Error');

// Warning
showWarning('You have reached 80% of your transaction limit.');
showWarning('Your session will expire in 5 minutes.', 'Session Expiring');

// Info
showInfo('New features are available!');
showInfo('Your report is being generated.', 'Processing');
```

**Advanced Usage:**
```javascript
// Custom duration (default is 5000ms)
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Upload Complete',
  message: 'Your file has been uploaded.',
  duration: 3000 // 3 seconds
});

// Persistent toast (doesn't auto-close)
addToast({
  type: 'error',
  title: 'Critical Error',
  message: 'Please contact support.',
  duration: 0 // Won't auto-close
});
```

---

### 3. Password Visibility Toggle

**Already Implemented in Login & Register**

**How it works:**
```javascript
const [showPassword, setShowPassword] = useState(false);

<div className="password-input-group">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    type="button"
    className="password-toggle-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "👁️" : "👁️‍🗨️"}
  </button>
</div>
```

**To add to other forms:**
1. Add state: `const [showPassword, setShowPassword] = useState(false);`
2. Wrap input in `<div className="password-input-group">`
3. Change input type based on state
4. Add toggle button

---

### 4. Password Strength Indicator

**Already Implemented in Register**

**How it works:**
```javascript
const [passwordStrength, setPasswordStrength] = useState("");

const checkPasswordStrength = (password) => {
  if (password.length === 0) return "";
  if (password.length < 6) return "weak";
  if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) 
    return "medium";
  if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) 
    return "strong";
  return "medium";
};

// In onChange handler
setPasswordStrength(checkPasswordStrength(value));

// In JSX
{password && (
  <div className={`password-strength password-${passwordStrength}`}>
    <div className="strength-bar">
      <div className="strength-fill"></div>
    </div>
    <span className="strength-text">
      Password strength: <strong>{passwordStrength}</strong>
    </span>
  </div>
)}
```

---

## 🚀 Quick Implementation Guide

### Adding Confirm Dialog to Delete Button

**Before:**
```javascript
const handleDelete = (id) => {
  deleteTransaction(id);
};

<button onClick={() => handleDelete(transaction.id)}>
  Delete
</button>
```

**After:**
```javascript
const [deleteId, setDeleteId] = useState(null);

const handleDelete = () => {
  deleteTransaction(deleteId);
  setDeleteId(null);
};

<button onClick={() => setDeleteId(transaction.id)}>
  Delete
</button>

<ConfirmDialog
  isOpen={deleteId !== null}
  onClose={() => setDeleteId(null)}
  onConfirm={handleDelete}
  title="Delete Transaction"
  message="Are you sure? This cannot be undone."
  type="danger"
/>
```

---

### Adding Toast Notifications to API Calls

**Before:**
```javascript
const saveTransaction = async () => {
  try {
    await api.post('/transactions', data);
    alert('Saved!');
  } catch (error) {
    alert('Error!');
  }
};
```

**After:**
```javascript
const saveTransaction = async () => {
  try {
    await api.post('/transactions', data);
    showSuccess('Transaction saved successfully!');
  } catch (error) {
    showError('Failed to save. Please try again.');
  }
};
```

---

## 📱 Mobile Considerations

All components are mobile-responsive:
- Touch-friendly button sizes (44x44px minimum)
- Proper spacing for fat fingers
- Swipe-friendly interactions
- Readable text sizes

---

## ♿ Accessibility

All components include:
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

**Keyboard Shortcuts:**
- `Esc` - Close dialogs
- `Enter` - Confirm action
- `Tab` - Navigate between buttons

---

## 🎨 Customization

### Custom Toast Styles

Add to your CSS:
```css
.toast.toast-custom {
  border-left-color: #purple;
  background: linear-gradient(135deg, rgba(128, 0, 128, 0.1), white);
}
```

Use:
```javascript
addToast({
  type: 'custom',
  message: 'Custom styled toast!'
});
```

### Custom Confirm Dialog

```javascript
<ConfirmDialog
  isOpen={show}
  onClose={close}
  onConfirm={confirm}
  title={<span>🎉 Special Offer!</span>}
  message={
    <div>
      <p>Upgrade now and get 20% off!</p>
      <ul>
        <li>Unlimited transactions</li>
        <li>AI features</li>
        <li>Priority support</li>
      </ul>
    </div>
  }
  confirmText="Upgrade Now"
  type="info"
/>
```

---

## 🧪 Testing Examples

### Test Confirm Dialog
```javascript
// Test opening
fireEvent.click(screen.getByText('Delete'));
expect(screen.getByText('Are you sure?')).toBeInTheDocument();

// Test confirming
fireEvent.click(screen.getByText('Confirm'));
expect(mockDelete).toHaveBeenCalled();

// Test canceling
fireEvent.click(screen.getByText('Cancel'));
expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
```

### Test Toast
```javascript
// Test showing toast
act(() => {
  showSuccess('Test message');
});
expect(screen.getByText('Test message')).toBeInTheDocument();

// Test auto-close
await waitFor(() => {
  expect(screen.queryByText('Test message')).not.toBeInTheDocument();
}, { timeout: 6000 });
```

---

## 💡 Best Practices

1. **Use Confirm Dialog for:**
   - Deleting data
   - Logging out
   - Canceling subscriptions
   - Irreversible actions

2. **Use Toast for:**
   - Success messages
   - Error messages
   - Info notifications
   - Progress updates

3. **Don't overuse:**
   - Too many confirmations = annoying
   - Too many toasts = overwhelming
   - Use sparingly for important actions

4. **Keep messages short:**
   - Title: 2-5 words
   - Message: 1-2 sentences
   - Clear and actionable

---

## 🔗 Related Files

- `finvoice-frontend/src/components/ConfirmDialog.js`
- `finvoice-frontend/src/components/Toast.js`
- `finvoice-frontend/src/components/login.js`
- `finvoice-frontend/src/components/register.js`
- `finvoice-frontend/src/App.css`

---

**Last Updated**: December 17, 2024
