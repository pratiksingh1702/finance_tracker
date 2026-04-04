# Backend Documentation - Finance Analytics Platform

This document provides a comprehensive overview of the backend architecture, modules, and security implementation for the Finance Analytics Platform.

## 1. Tech Stack
- **Runtime**: Node.js (>= 18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest & Supertest

## 2. Architectural Patterns
The backend follows a **Layered Clean Architecture** pattern to ensure separation of concerns, maintainability, and testability.

### Layers:
1.  **Entry Point (`server.js`)**: Initialises the database connection and starts the Express server.
2.  **Application (`app.js`)**: Configures middlewares (security, logging, parsing) and mounts the root router.
3.  **Routes (`src/routes`)**: Defines API endpoints and maps them to controllers.
4.  **Controllers (`src/modules/*/controller.js`)**: Orchestrates the request-response cycle. Handles input extraction and calls appropriate services.
5.  **Services (`src/modules/*/service.js`)**: Contains the core business logic. Agnostic of Express or MongoDB specifics.
6.  **Repositories (`src/repositories`)**: Encapsulates data access logic. Uses `BaseRepository` for common CRUD operations.
7.  **Models (`src/modules/*/models`)**: Defines Mongoose schemas and database constraints.

## 3. Core Modules

### Authentication & User Management
- **Features**: Registration, Login, Token Refresh, Profile Retrieval.
- **Security**: Password hashing using `bcryptjs`, JWT for session management.
- **Files**: `src/modules/auth`, `src/modules/user`.

### Financial Engine
- **Features**: Transaction management (CRUD), Category management, Soft deletes.
- **Logic**: Handles income/expense categorisation and historical data tracking.
- **Files**: `src/modules/finance`.

### Analytics Engine
- **Features**: Complex aggregations for financial summaries, monthly/weekly trends, and category-level breakdowns.
- **Implementation**: Uses MongoDB Aggregation Pipelines for high-performance data processing.
- **Files**: `src/modules/analytics`.

## 4. Security Layers
The platform implements multiple security layers to protect sensitive financial data:

-   **HTTP Security**: `helmet` for secure headers, `cors` for cross-origin resource sharing.
-   **Input Sanitisation**: `xss-clean` to prevent XSS attacks, `express-mongo-sanitize` to prevent NoSQL injection.
-   **Rate Limiting**: `express-rate-limit` to prevent brute-force and DoS attacks.
-   **Authentication**: `authenticate` middleware verifies JWT access tokens in the `Authorization` header.
-   **Authorization**: `authorize` middleware implements Role-Based Access Control (RBAC) using a permission map.

## 5. API Documentation
The API is documented using Swagger. Once the server is running, documentation is available at:
`http://localhost:3000/api/docs`

## 6. Testing Procedures
- **Unit Tests**: Test individual services and utilities (`npm run test:unit`).
- **Integration Tests**: Test API endpoints and database interactions (`npm run test:integration`).
- **E2E Tests**: Test complete user flows (`tests/e2e`).

## 7. Success Criteria
- All API responses follow a consistent `{ success, data, message }` or `{ success, error, message }` format.
- Soft deletes are respected across all financial queries.
- Unauthorised access to protected routes returns a 401/403 status code.
- Heavy aggregations complete within acceptable time limits (< 200ms for dashboard).
