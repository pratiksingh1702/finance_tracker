# 🚀 Finance Dashboard Frontend – Execution Guide

## 🎯 Objective
Build a **production-grade, scalable, and visually premium UI** using the provided folder structure. This guide provides the roadmap to connect the React/Vite frontend with the backend while maintaining architectural purity.

---

## 🏗️ Architecture: Feature-Based Design
The project follows a **Feature-Based Modular Architecture**. Each feature (Auth, Finance, Users, Analytics) is a self-contained unit.

### 📦 Folder Responsibilities

#### `/src/features` (The Core)
Every entity must follow this strict flow:
- **`Slice`**: Manages entity state (e.g., `transactions`, `loading`, `error`).
- **`Thunks`**: Handles async operations (e.g., `fetchTransactions`).
- **`Selectors`**: Memoized functions to access state (e.g., `selectTotalBalance`).

#### `/src/services` (The Communication Layer)
- **`api.client.js`**: Centralized Axios instance.
- **Interceptors**: 
  - `auth.interceptor.js`: Injects JWT from storage into every request.
  - `error.interceptor.js`: Handles global errors (401 auto-logout, 403 access denied, 500 server error).

#### `/src/components` (Atomic UI)
- **`ui/`**: Basic building blocks (Buttons, Inputs, Modals, Cards).
- **`forms/`**: Composition of UI components for data entry.
- **`charts/`**: Data visualization components (Bar, Pie, Line).
- **`shared/`**: Global logic components (ProtectedRoute, RoleGuard).

#### `/src/pages` (View Layer)
- These components are only responsible for layout and data fetching triggers. They should **never** contain business logic.

---

## 🔗 Data Flow Strategy (STRICT)

1.  **Component**: Triggers an action: `dispatch(fetchSummary(filters))`.
2.  **Thunk**: Calls the service: `analyticsService.getSummary(params)`.
3.  **Service**: Executes request: `apiClient.get('/analytics/summary', { params })`.
4.  **Interceptors**: 
    - **Request**: Injects `Authorization: Bearer <token>`.
    - **Response**: Standardizes error format.
5.  **Slice**: Updates global state based on thunk lifecycle (`pending`, `fulfilled`, `rejected`).
6.  **Selectors**: UI re-renders automatically with fresh data.

---

## 🔐 Authentication & Security

- **Storage**: Use `localStorage` for the JWT via `/utils/storage.js`.
- **Session Persistence**: `App.jsx` must verify the token on mount via `authThunks.checkAuth()`.
- **Route Guards**:
  ```jsx
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route element={<RoleGuard allowedRoles={['admin']} />}>
      <Route path="/users" element={<UsersPage />} />
    </Route>
  </Route>
  ```

---

## 📊 Analytics & Charts Strategy

1.  **Fetch**: Use `analytics.service.js` to hit `/api/v1/analytics/dashboard`.
2.  **Transform**: Convert raw aggregation data in `/utils/transform.js` before passing to charts.
3.  **Visuals**: Use `SummaryCard.jsx` for KPIs and `LineChart.jsx` for monthly trends.

---

## 🎨 Design System & UI Consistency

- **Theme**: Strictly use `variables.css` for primary colors, spacing, and border-radius.
- **Loading**: Use `Spinner.jsx` or `Skeleton` states for every async operation.
- **Feedback**: Every CRUD operation must trigger a `useToast` notification.
- **Empty States**: Use `EmptyState.jsx` for empty tables or analytics results.

---

## 🛠️ Implementation Example (Transactions)

### 1. Service Layer
```javascript
// src/services/finance.service.js
export const getTransactions = (params) => apiClient.get('/transactions', { params });
```

### 2. Feature Layer (Thunk)
```javascript
// src/features/finance/financeThunks.js
export const fetchTransactions = createAsyncThunk('finance/fetchAll', async (params) => {
  const response = await financeService.getTransactions(params);
  return response.data;
});
```

### 3. Component Layer
```javascript
// src/pages/transactions/TransactionsPage.jsx
const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(selectTransactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (loading) return <Spinner />;
  return <Table data={data} />;
};
```

---

## 🚀 Performance & Scalability

- **Lazy Loading**: Code-split pages in `router.jsx` using `React.lazy`.
- **Memoization**: Use `useMemo` for heavy calculations in `analyticsSelectors.js`.
- **Debouncing**: Use `useDebounce` hook for all search/filter inputs.
- **Pagination**: Implement `usePagination` hook to handle large data sets from the backend.
