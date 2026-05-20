# 🎨 Frontend Architecture Blueprint

This document serves as the personal reference file for managing client-side application logic, layouts, and state for the Blog App.

---

## 🎨 Architecture & Styling Principles

- **Framework Specifications:** Built with React 18 and bundled using Vite for rapid development and optimized builds.
- **Routing Engine:** Utilizes `react-router-dom` (specifically `createBrowserRouter`) for object-based, centralized route management.
- **Styling Configuration:** Powered by Tailwind CSS. Custom design tokens, color palettes, and global button/input classes are abstracted into `src/styles/common.js` for consistent reuse.

---

## 📂 Client Directory Map

```text
BLOG-APP-FRONTEND/
├── index.html              # Entry point
├── src/
│   ├── App.jsx             # Main router configuration and layout
│   ├── main.jsx            # React root mount
│   ├── components/         # React components
│   │   ├── Articles/Cards  # Reusable UI elements for displaying posts
│   │   ├── Dashboards      # Role-specific dashboard views
│   │   ├── Modals          # Custom ConfirmModal for user interactions
│   │   └── Auth            # Login & Register views
│   ├── store/              # Zustand global state management
│   │   └── authStore.js    # Authentication and user session state
│   └── styles/             # Shared style definitions
│       └── common.js       # Tailwind class constants
```

---

## 🧩 Component & View Hierarchy

**Shared Global Elements:**
- **`Header.jsx`**: The main navigation bar handling responsive menus and dynamic links based on auth state.
- **`ConfirmModal.jsx`**: A reusable, premium-looking modal used for confirming destructive or major actions (like deactivating an article).
- **`ArticleCard.jsx`**: A grid card displaying article summaries, categories, and action buttons.

**Primary Page Views:**
- **`Home.jsx`**: Global feed for users/authors, and landing page for guests.
- **`UserDashboard.jsx`**: Displays a personalized greeting and the global feed.
- **`AuthorDashboard.jsx`**: The author's workspace for managing active and deactivated articles.
- **`AdminDashboard.jsx`**: Moderation view for administrators.
- **`Article.jsx`**: The single article reading view, including the comments section.

---

## 🗂️ State Management

**Global Stores (Zustand):**
- **`authStore.js`**: Manages the `currentUser`, `isAuthenticated` boolean, and `loading` states. It exposes functions like `login`, `logout`, and `checkAuth` to communicate with the backend and update the global UI state accordingly.

---

## 🛣️ Application Routing Map

**Public Routing Paths:**
- `/` or `/home` - Landing page / Global Feed
- `/login` - User Authentication
- `/register` - New Account Creation

**Protected Security Routing (`ProtectedRoute.jsx`):**
- `/add-article` - Guarded. Requires `AUTHOR` role.
- `/edit-article/:articleId` - Guarded. Requires `AUTHOR` role.
- `/author-dashboard` - Guarded. Requires `AUTHOR` role.
- `/user-dashboard` - Guarded. Requires `USER` role.
- `/admin-dashboard` - Guarded. Requires `ADMIN` role.
- `/article/:articleId` - Guarded. Accessible by authenticated users/authors/admins.

---

## 🌐 Network & API Integration

- **Axios Setup:** Axios is used for all HTTP requests.
- **Security:** `{ withCredentials: true }` is set on API calls to ensure that the secure, HTTP-only JWT token stored in the browser cookie is automatically attached to network headers on every request to the backend.
