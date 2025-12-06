// API Configuration
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    SIGNUP: `${API_URL}/api/auth/signup`,
  },
  DASHBOARD: `${API_URL}/api/dashboard`,
  TRANSACTIONS: `${API_URL}/api/transactions`,
  BALANCE_SHEET: `${API_URL}/api/balancesheet`,
  ALERTS: `${API_URL}/api/alerts`,
  PROFILE: `${API_URL}/api/profile`,
};
