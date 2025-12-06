# AI Coding Agent Instructions for FinVoice.AI

Welcome to the **FinVoice.AI** codebase! This document provides essential guidelines for AI coding agents to be productive in this project. The goal is to ensure consistency, maintainability, and alignment with the project's architecture and conventions.

---

## 📂 Project Overview
**FinVoice.AI** is a finance management web application designed to automate accounting, manage payables, and provide financial insights. It consists of:

- **Frontend**: React-based SPA (Single Page Application).
- **Backend**: Node.js/Express server (with plans for Python/Flask integration).
- **Database**: MongoDB (configured in `db.js`).

Key features include:
- Secure authentication (JWT-based).
- Interactive dashboard.
- Balance sheet and payable alerts.
- User profile management.

---

## 🏗️ Architecture
### **Frontend**
- Located in `finvoice-frontend/`.
- Built with React, using functional components and hooks.
- Key directories:
  - `src/components/`: Contains reusable components like `login.js`, `dashboard.js`, `balancesheet.js`.
  - `public/`: Static assets like `index.html`.

### **Backend**
- Located in `finvoice-backend/`.
- Built with Node.js and Express.
- Key directories:
  - `routes/`: API endpoints (e.g., `authroutes.js` for authentication).
  - `models/`: Mongoose schemas (e.g., `user.js`).
  - `config/`: Configuration files (e.g., `db.js` for database connection).

---

## 🔄 Data Flow
1. **Frontend** sends API requests to the backend (e.g., login, fetch dashboard data).
2. **Backend** processes requests, interacts with the database, and returns JSON responses.
3. **Frontend** updates the UI based on the backend's response.

---

## 🛠️ Developer Workflows
### **Frontend**
- Start the development server:
  ```bash
  cd finvoice-frontend
  npm start
  ```
- Build for production:
  ```bash
  npm run build
  ```

### **Backend**
- Start the backend server:
  ```bash
  cd finvoice-backend
  npm start
  ```
- Environment variables are stored in `.env` (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).

### **Testing APIs**
- Use Postman or similar tools to test endpoints (e.g., `POST /api/auth/login`).
- Example request:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

---

## 📏 Conventions
- **Frontend**:
  - Use functional components and React hooks.
  - Follow the file structure in `src/components/` for modularity.
- **Backend**:
  - Use `async/await` for asynchronous operations.
  - Group related routes in the `routes/` directory.

---

## 🔗 Integration Points
- **Frontend to Backend**:
  - API Base URL: `http://localhost:5000`.
  - Authentication: JWT stored in `localStorage`.
- **Backend to Database**:
  - MongoDB connection configured in `config/db.js`.

---

## 🐛 Debugging Tips
- **Frontend**:
  - Use browser DevTools (Network tab) to inspect API requests.
- **Backend**:
  - Check server logs for errors.
  - Ensure `.env` variables are correctly set.

---

For any unclear sections or additional guidance, feel free to ask!