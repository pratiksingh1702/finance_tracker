  # Finance Analytics Platform

A professional full-stack finance management and analytics dashboard built with Node.js, Express, MongoDB, and React.

## 🚀 Overview
The Finance Analytics Platform is a production-grade application designed to help users track, categorise, and analyse their financial data. It features a robust backend with complex data aggregation capabilities and a modern, responsive frontend with interactive data visualisations.

## ✨ Key Features
- **Secure Authentication**: JWT-based auth with token refresh and persistent sessions.
- **RBAC (Role-Based Access Control)**: Granular permissions for users and administrators.
- **Transaction Management**: Full CRUD operations for income and expenses with category support.
- **Advanced Analytics**:
  - Monthly/Weekly income vs expense trends.
  - Category-based spending breakdown.
  - Comprehensive financial health summaries.
- **Admin Dashboard**: Manage users and monitor platform-wide activity.
- **Modern UX**: Real-time notifications, loading states, and mobile-responsive layouts.

## 🏗 Architecture

### Backend (Node.js + MongoDB)
- **Clean Architecture**: Separation of concerns through layers (Routes, Controllers, Services, Repositories).
- **Security First**: Protection against XSS, NoSQL Injection, and brute-force attacks.
- **Aggregations**: High-performance MongoDB aggregation pipelines for analytics.
- **Docs**: Interactive API documentation via Swagger.

### Frontend (React + Redux)
- **State Management**: Redux Toolkit for predictable state transitions.
- **Routing**: React Router v6 with protected route guards.
- **Visualisation**: Beautiful, responsive charts powered by Recharts.
- **Styling**: Utility-first CSS with Tailwind CSS.

## 🛠 Tech Stack
- **Backend**: Node.js, Express, Mongoose, JWT, Joi, Winston.
- **Frontend**: React, Redux Toolkit, React Router, Recharts, Tailwind CSS, Axios.
- **DevOps**: ESLint, Prettier, Vitest, Jest.

## 🚦 Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

For detailed instructions, see the [Setup Guide](./SETUP_GUIDE.md).

## 📄 Documentation
- [Backend Documentation](./backend/BACKEND_DOCUMENTATION.md)
- [Frontend Documentation](./frontend/FRONTEND_DOCUMENTATION.md)
- [Setup Guide](./SETUP_GUIDE.md)

## 🧪 Testing
Both backend and frontend include comprehensive test suites.
- **Backend**: `cd backend && npm test`
- **Frontend**: `cd frontend && npm run test:run`

## 🤝 Contributing
Contributions are welcome! Please read our contribution guidelines before submitting a PR.

## ⚖️ License
This project is licensed under the MIT License.
