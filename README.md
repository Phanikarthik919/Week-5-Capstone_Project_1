# Blog App - Capstone Project

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

*A comprehensive Blog Application built with the MERN stack featuring role-based access control for Users, Authors, and Admins.*

---

## 📋 Table of Contents
- [📖 About the Project](#-about-the-project)
- [✨ Features List](#-features-list)
- [🖼️ Project Screenshots](#-project-screenshots)
- [💻 Tech Stack & Ecosystem](#-tech-stack--ecosystem)
- [🚀 Local Setup (The 5-Minute Guide)](#-local-setup-the-5-minute-guide)
- [☁️ Cloud Production Guide (Deployment)](#️-cloud-production-guide-deployment)
- [👤 Author Information](#-author-information)

---

## 📖 About the Project

**The Problem Statement:** Modern communities need a platform where content creators (authors) can share their thoughts while administrators ensure the quality of content, and readers can consume and interact with the articles securely.

**The Solution:** This Blog App provides a role-based ecosystem where Authors can create and manage their own articles, Users can read and comment on global articles, and Admins can oversee the platform.

**Live Production URLs:**
- **[🚀 Live Web Application (Frontend)](https://week-5-capstone-project-1.vercel.app/)**
- **[🖥️ Hosted API Server (Backend)](https://blog-app-api-peach-gamma.vercel.app)**

---

## ✨ Features List

- **Core Functionality:**
  - Secure User Authentication and Authorization using JWT and Cookies.
  - Role-Based Access Control (RBAC):
    - **User**: Read articles, filter by category, add comments.
    - **Author**: Create, edit, deactivate/activate, and manage their own articles.
    - **Admin**: Moderate content and manage user/author accounts.
  - Full CRUD operations for articles with categories.
- **Advanced Implementations:**
  - Image uploading and cloud storage via Cloudinary.
  - Clean and responsive UI using Tailwind CSS with glassmorphism touches.
  - Custom modals and error boundaries for a premium user experience.

---

## 🖼️ Project Screenshots (The Visual Gallery)

- **Login Page:** ![Login Page](BLOG-APP-FRONTEND/docs/assets/login-page.png)
- **Global Articles Feed:** ![Global Feed](BLOG-APP-FRONTEND/docs/assets/global-articles.png)
- **User Dashboard:** ![User Dashboard](BLOG-APP-FRONTEND/docs/assets/User-dashboard.png)
- **Author Dashboard:** ![Author Dashboard](BLOG-APP-FRONTEND/docs/assets/author-dashboard.png)
- **New Article Editor:** ![New Article](BLOG-APP-FRONTEND/docs/assets/new-article.png)
- **Article & Comments View:** ![Comments View](BLOG-APP-FRONTEND/docs/assets/user-comments.png)

---

## 💻 Tech Stack & Ecosystem

| Category | Technology | Primary Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React + Vite | Client-side rendering and UI compilation. |
| **Styling** | Tailwind CSS | Rapid utility-first styling and responsive layouts. |
| **State Management** | Zustand | Lightweight global state for authentication and user sessions. |
| **Backend Runtime** | Node.js + Express.js | REST API server logic and middleware. |
| **Database** | MongoDB + Mongoose | Cloud document database and data modeling. |
| **Security** | JWT + bcryptjs | Token-based authentication and password hashing. |
| **Cloud Storage** | Cloudinary | Storing user profile images. |

---

## 🚀 Local Setup (The 5-Minute Guide)

**System Prerequisites:** Node.js v18+, Git, npm.

**Codebase Cloning:**
```bash
git clone https://github.com/Phanikarthik919/Week-5-Capstone_Project_1.git
cd Week-5-Capstone_Project_1
```

**Backend Local Boot:**
1. Navigate to the backend directory: `cd BLOG-APP-BACKEND`
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
   ```env
   PORT=4000
   DB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server: `npm run dev`

**Frontend Local Boot:**
1. Navigate to the frontend directory: `cd ../BLOG-APP-FRONTEND`
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
   ```env
   VITE_API_URL=http://localhost:4000
   ```
4. Start the development server: `npm run dev`

---

## ☁️ Cloud Production Guide (Deployment)

### Hosting Destinations
- **Frontend (UI):** Vercel
- **Backend (API):** Vercel (or Render)
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary

### Production Deployment Log
**Backend Deployment:**
1. Ensure your `package.json` has a `"start": "node server.js"` script.
2. Add a `vercel.json` for routing if deploying the Express app to Vercel.
3. Add all your `.env` variables to your cloud provider's environment variables settings.

**Frontend Deployment:**
1. Build the production app: `npm run build`
2. Connect the repository to Vercel.
3. Add the `VITE_API_URL` pointing to your hosted backend URL in the Vercel environment variables.

---

## 👤 Author Information

**K Phani Karthik**  
Full-Stack Developer  
[GitHub Profile](https://github.com/Phanikarthik919)

*For detailed client and server architecture documentation, please see the `README.md` files in the respective `BLOG-APP-FRONTEND` and `BLOG-APP-BACKEND` directories.*
