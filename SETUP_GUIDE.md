# Setup Guide - Finance Analytics Platform

Follow these steps to set up the project locally for development.

## 1. Prerequisites
- **Node.js**: version 18.0.0 or higher
- **npm**: version 9.0.0 or higher
- **MongoDB**: version 6.0 or higher (running locally or via Atlas)

## 2. Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the `backend` folder:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/finance-dashboard
    JWT_ACCESS_SECRET=your-dev-secret-key
    JWT_REFRESH_SECRET=your-refresh-secret-key
    JWT_ACCESS_EXPIRY=10d
    JWT_REFRESH_EXPIRY=30d
    LOG_LEVEL=info
    ```

4.  **Initialise the database**:
    Run the seeder script to create default roles, an admin user, and sample transactions:
    ```bash
    npm run seed
    ```
    *Default Admin Credentials:*
    - **Email**: `admin@finance-dashboard.com`
    - **Password**: `password123`

5.  **Start the server**:
    ```bash
    npm run dev
    ```
    The API will be available at `http://localhost:3000`.

## 3. Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the `frontend` folder:
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api/v1
    ```

4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 4. Running Tests

### Backend:
- `npm test`: Run all tests.
- `npm run test:unit`: Run unit tests only.
- `npm run test:integration`: Run integration tests.

### Frontend:
- `npm run test`: Run tests in watch mode.
- `npm run test:run`: Run tests once.

## 5. Troubleshooting
- **MongoDB Connection**: Ensure your MongoDB service is running. If using Docker, run `docker run -d -p 27017:27017 mongo`.
- **Port Conflicts**: If port 3000 or 5173 is occupied, change the `PORT` in `.env` or check for running processes.
- **Node Version**: Check your node version with `node -v`. Use `nvm` to switch if necessary.
