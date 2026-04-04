# Frontend Documentation - Finance Analytics Platform

This document provides a detailed overview of the frontend implementation, including state management, routing, components, and UX features.

## 1. Tech Stack
- **Library**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK)
- **Routing**: React Router v6 (Data APIs)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Testing**: Vitest & React Testing Library

## 2. Project Structure
The frontend follows a **Feature-Based Architecture** to keep the codebase modular and scalable.

-   `src/app`: Application-level configurations (Router, Providers).
-   `src/features`: Encapsulated feature logic (Redux slices, thunks, selectors).
-   `src/components`: UI components categorised into `ui` (atoms), `shared` (molecules), and `forms`.
-   `src/pages`: Page-level components corresponding to routes.
-   `src/services`: API integration layer.
-   `src/layouts`: Layout wrappers (Auth, Dashboard).
-   `src/utils`: Helper functions and formatters.

## 3. State Management
Redux Toolkit is used for global state management.

### Slices:
-   `authSlice`: Manages user authentication state, tokens, and session initialization.
-   `financeSlice`: Manages transactions, categories, and filtering state.
-   `analyticsSlice`: Manages dashboard summaries, trends, and breakdown data.
-   `userSlice`: Manages administrative user management state.

### Data Flow:
Components dispatch **Async Thunks** -> Thunks call **Services** -> Services perform **Axios** requests -> Thunks update the **Slice** state -> Components consume state via **Selectors**.

## 4. Routing & Protection
The application uses `createBrowserRouter` for declarative routing.

-   **Public Routes**: Accessible without login (Login, Register). Wrapped in `PublicRoute` to redirect authenticated users.
-   **Protected Routes**: Requires a valid JWT. Wrapped in `ProtectedRoute`.
-   **Role-Based Access**: Certain pages (e.g., User Management) are wrapped in `RoleGuard` to restrict access to Admins only.

## 5. UI & UX Features
-   **Responsive Design**: Mobile-first approach using Tailwind CSS.
-   **Interactive Charts**: Dynamic data visualisation using Recharts with tooltips and legends.
-   **Real-time Feedback**: `react-hot-toast` for success/error notifications.
-   **Loading States**: Custom `Spinner` components and skeleton loaders for cards.
-   **Form Handling**: Controlled components with validation.
-   **Session Persistence**: Automatic token refresh and persistent login via local storage.

## 6. API Integration
Axios is configured with interceptors:
-   **Request Interceptor**: Automatically attaches the Bearer token to the `Authorization` header.
-   **Response Interceptor**: Handles 401 Unauthorized errors by attempting a token refresh. Redirects to login if the refresh fails.

## 7. Testing Procedures
-   **Component Tests**: Validate individual UI components.
-   **Integration Tests**: Test complex user flows (e.g., Authentication Flow in `src/tests/auth-flow.test.jsx`).
-   **Commands**:
    -   `npm run test`: Run tests in watch mode.
    -   `npm run test:run`: Run tests once for CI.

## 8. Success Criteria
-   Zero console errors during navigation.
-   Accessible UI with proper ARIA labels and semantic HTML.
-   Charts correctly handle empty data states with placeholder indicators.
-   Seamless session recovery after page refresh.
