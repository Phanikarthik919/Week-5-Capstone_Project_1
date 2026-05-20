# ⚙️ Backend Server & Data Blueprint

This document details the data structures, server logic, access protections, and the endpoint registry for the Blog App backend.

---

## ⚙️ Server Architecture Overview

- **Framework Setup:** Node.js with the Express.js framework for robust API routing.
- **Data Modeling:** Mongoose ODM is used to define strict schemas and interact with the MongoDB database.
- **Security & Parsing:** Implements CORS for cross-origin requests, `cookie-parser` for handling JWT tokens, and bcryptjs for secure password hashing.

---

## 📂 Server Directory Map

```text
BLOG-APP-BACKEND/
├── server.js              # Application entry point and DB connection
├── APIs/                  # Route controllers
│   ├── AuthorAPI.js       # Endpoints specific to authors
│   ├── UserAPI.js         # Endpoints specific to users
│   ├── AdminAPI.js        # Endpoints specific to admins
│   └── commonAPI.js       # Shared endpoints (login, logout)
├── Config/                # Third-party integrations
│   ├── cloudinary.js      # Cloudinary connection
│   └── multer.js          # File upload middleware
├── middlewares/           # Request interceptors
│   ├── checkAuthor.js     # Validates author ownership
│   ├── verifyToken.js     # Validates JWT and checks RBAC roles
│   └── errorHandler.js    # Global error interceptor
├── models/                # Mongoose Database Schemas
│   ├── ArticleModel.js    # Article data structure
│   └── UserModel.js       # User/Author data structure
└── req.http               # REST API testing file
```

---

## 🗄️ Database Schemas & Entities

**User Document Model (`UserModel.js`):**
- Tracks `firstName`, `lastName`, `email`, `password` (hashed), `profileImageUrl`.
- `role`: Enum restricted to `["AUTHOR", "USER", "ADMIN"]`.
- `isActive`: Boolean for blocking/unblocking accounts.

**Article Document Model (`ArticleModel.js`):**
- Tracks `title`, `category`, `content`.
- `author`: ObjectId referencing the User model.
- `comments`: Array of subdocuments containing the `user` reference and `comment` string.
- `isArticleActive`: Boolean for soft-deleting/deactivating articles.

---

## 🔒 Middleware Gatekeepers

- **Authentication Validation (`verifyToken.js`):** Intercepts requests, reads the HTTP-only cookie, decodes the JWT, and verifies the active user's role against the allowed roles for that specific endpoint.
- **Resource Ownership (`checkAuthor.js`):** Ensures that the logged-in user is attempting to modify their own content and not someone else's.
- **File Upload Validation (`multer.js` & `cloudinaryUpload.js`):** Intercepts multipart form data, stores files temporarily in memory, and handles the secure upload pipeline to Cloudinary.
- **Global Error Interceptor (`errorHandler.js`):** Catches uncaught server issues and sends clean error alerts back to the client instead of crashing the process.

---

## 🔌 API Endpoint Registry

### Common Routes (`/common-api`)
| Verb | URI Pathway | Description | Security |
| :--- | :--- | :--- | :--- |
| POST | `/login` | Authenticate user and issue JWT cookie. | Public |
| GET | `/logout` | Clear the JWT cookie to end session. | Public |
| GET | `/check-auth` | Verify current session and return user data. | Auth Required |
| PUT | `/change-password` | Update account password. | Auth Required |

### User Routes (`/user-api`)
| Verb | URI Pathway | Description | Security |
| :--- | :--- | :--- | :--- |
| POST | `/users` | Register a new user account (with image). | Public |
| GET | `/articles` | Read all active global articles. | USER, AUTHOR, ADMIN |
| GET | `/articles/:id` | Read a specific article by ID. | USER, AUTHOR, ADMIN |
| PUT | `/articles/comments` | Add a comment to an article. | USER, AUTHOR |

### Author Routes (`/author-api`)
| Verb | URI Pathway | Description | Security |
| :--- | :--- | :--- | :--- |
| POST | `/users` | Register a new author account (with image). | Public |
| POST | `/articles` | Create a new article. | AUTHOR |
| GET | `/articles/:id` | Read all articles belonging to a specific author. | AUTHOR |
| PUT | `/articles` | Edit an existing article. | AUTHOR |
| PUT | `/articles/deactivate`| Soft-delete (deactivate) an article. | AUTHOR |
| PUT | `/articles/activate` | Restore (activate) a deactivated article. | AUTHOR |

### Admin Routes (`/admin-api`)
| Verb | URI Pathway | Description | Security |
| :--- | :--- | :--- | :--- |
| PUT | `/block-user/:id` | Suspend a user/author account. | ADMIN |
| PUT | `/unblock-user/:id`| Restore a user/author account. | ADMIN |