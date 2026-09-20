# TaskSpace Backend ⚙️

This is the backend service for the TaskSpace project management application. It provides a robust RESTful API built with Node.js, Express, and MongoDB, handling user authentication, project management, and task operations.

## ✨ Features

- **Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
- **Role-Based Access Control (RBAC):** Middleware to restrict sensitive operations (like deletions) to Admin users.
- **RESTful API:** Clean and standard API endpoints for Projects, Tasks, and Users.
- **Data Validation & Security:** Password hashing with `bcryptjs` and route protection.
- **Pagination & Sorting:** Scalable endpoints for retrieving large datasets.

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Security:** `jsonwebtoken`, `bcryptjs`, `cors`
- **Environment:** `dotenv`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB URI (Local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreygupta15/flowstate-task-manager.git
   cd flowstate-task-manager/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root of the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`.

## 📚 API Endpoints

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Projects:** `GET /api/projects`, `POST /api/projects`, `DELETE /api/projects/:id`
- **Tasks:** `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`
- **Dashboard:** `GET /api/dashboard/stats`
