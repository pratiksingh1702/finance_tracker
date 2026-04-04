# 🏛️ Finance Dashboard – Frontend Architecture Documentation

This document provides a deep dive into the frontend architecture of the Finance Dashboard. It is designed for a **scalable, modular, and maintainable** React/Vite application.

---

## 📂 Root Configuration Files
- **`vite.config.js`**: Build tool configuration (Vite).
- **`jsconfig.json`**: Path aliasing and JS language features.
- **`.eslintrc.js` / `.prettierrc`**: Linting and formatting rules to ensure code consistency.
- **`.env`**: Environment variables (e.g., `VITE_API_URL`).

---

## 📁 `src/app` (The Orchestrator)
- **`App.jsx`**: The root component. It wraps the app with the necessary providers and initializes the router.
- **`providers.jsx`**: Centralizes all context providers (Redux, Auth, Theme, etc.).
- **`router.jsx`**: Manages all routes, separating Public (Login/Register), Protected (Dashboard), and Admin-only routes.

---

## 📁 `src/assets` (Static Assets)
- **`icons/`**: SVGs and icon components.
- **`images/`**: Static images.
- **`styles/`**:
  - `globals.css`: Global styles and resets.
  - `themes.css`: Theme-specific variables (Dark/Light).
  - `variables.css`: Design system tokens (colors, spacing, shadows).

---

## 📁 `src/components` (The UI Building Blocks)
- **`charts/`**: High-level data visualization (Bar, Line, Pie) and Summary cards.
- **`forms/`**: Complex form logic for transactions, filters, and users.
- **`shared/`**: Global utility components:
  - `ProtectedRoute.jsx`: Redirects unauthenticated users.
  - `RoleGuard.jsx`: Renders content based on user roles (Admin/User).
  - `ErrorBoundary.jsx`: Gracefully handles runtime errors.
- **`ui/` (Atomic Design)**: The foundation. Pure, reusable components like `Button`, `Card`, `Input`, `Modal`, `Table`, and `Tooltip`. These use **CSS Modules** for isolated styling.

---

## 📁 `src/features` (The Logic Layer)
Following the **Redux Toolkit** pattern, each feature (Auth, Finance, User, Analytics) is self-contained:
- **`*Slice.js`**: Defines the state and synchronous reducers.
- **`*Thunks.js`**: Handles asynchronous API calls and side effects.
- **`*Selectors.js`**: Memoized functions to access specific state slices efficiently.

---

## 📁 `src/hooks` (Reusable Logic)
- **`useAuth.js`**: Shorthand for accessing auth state and methods.
- **`useFetch.js`**: A generic hook for managing API request lifecycle (loading, data, error).
- **`usePagination.js`**: Encapsulates pagination logic for tables.
- **`useToast.js`**: Triggers UI notifications.

---

## 📁 `src/layouts` (The Shell)
- **`DashboardLayout.jsx`**: The primary shell for logged-in users (includes Sidebar and Navbar).
- **`AuthLayout.jsx`**: Simple shell for authentication pages (Login/Register).
- **`Sidebar/` / `Navbar/`**: Navigation components.

---

## 📁 `src/pages` (The Views)
Route-level components that compose layouts and features. They are kept "thin," focusing on data fetching triggers and high-level layout.
- **`auth/`**: Login, Register, Forgot Password.
- **`dashboard/`**: Analytics, Overview.
- **`transactions/`**: List, Detail, Create.
- **`users/`**: User Management (Admin).

---

## 📁 `src/services` (The Communication Layer)
- **`api.client.js`**: Axios instance configured with base URL and timeouts.
- **`interceptors/`**:
  - `auth.interceptor.js`: Automatically attaches the Bearer token to requests.
  - `error.interceptor.js`: Handles 401s (token refresh/logout) and global error toasts.
- **Entity Services**: Individual services (`auth.service.js`, `finance.service.js`) for specific API domains.

---

## 📁 `src/store` (State Management)
- **`index.js`**: Configures the Redux store with middleware.
- **`root-reducer.js`**: Combines all feature slices.
- **`middleware/`**: Custom middleware (e.g., logger).

---

## 📁 `src/utils` (The Toolbox)
- **`cn.js`**: Utility for merging class names (Tailwind-style).
- **`format-currency.js` / `format-date.js`**: Standardized formatting for display.
- **`storage.js`**: Wrapper for `localStorage` / `sessionStorage`.
- **`validate.js`**: Common validation logic (regex, etc.).
