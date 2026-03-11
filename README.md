# Blog App - Capstone Project

A comprehensive Blog Application built with the MERN stack (MongoDB, Express, React, Node.js) featuring role-based access control for Users, Authors, and Admins.

## Features

- **Authentication & Authorization**: Secure login and registration using JWT and Cookies.
- **Role-Based Access Control (RBAC)**:
  - **User**: Read articles, filter by category, and manage their profile.
  - **Author**: Create, edit, delete, and manage their own articles.
  - **Admin**: Moderate content and manage user/author accounts.
- **Article Management**: Full CRUD operations for articles with categories.
- **Responsive Design**: Clean and functional UI built with Tailwind CSS.
- **State Management**: Client-side state handling with Zustand.

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Zustand (State Management)
- React Router (Routing)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- JWT & Cookie-Parser (Authentication)
- CORS (Cross-Origin Resource Sharing)

## 📁 Project Structure

```text
BLOG-APP/
├── BLOG-APP-FRONTEND/   # React client
└── BLOG-APP-BACKEND/    # Express server & API
```

## ⚙️ Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd BLOG-APP-BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=4000
   DB_URL=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd BLOG-APP-FRONTEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 License
This project was developed as part of the Suntek week-5 assignments.
