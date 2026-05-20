import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AddArticle from './components/AddArticle';
import UserDashboard from './components/UserDashboard';
import AuthorDashboard from './components/AuthorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Article from './components/Article';
import EditArticle from './components/EditArticle';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/authStore';

import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

// Trainer calls this RootLayout
function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Trainer defines routerObj strictly inside App component and utilizes nested children array correctly
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      // Trainer's crash handler location
      errorElement: <ErrorBoundary />, 
      children: [
        {
          index: true,
          element: <Navigate to="/home" replace />
        },
        {
          path: "home",
          element: <Home />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "add-article",
          element: (
             <ProtectedRoute allowedRole={["AUTHOR"]}>
               <AddArticle />
             </ProtectedRoute>
          )
        },
        {
          path: "user-dashboard",
          element: (
             <ProtectedRoute allowedRole={["USER"]}>
               <UserDashboard />
             </ProtectedRoute>
          )
        },
        {
          path: "author-dashboard",
          element: (
             <ProtectedRoute allowedRole={["AUTHOR"]}>
               <AuthorDashboard />
             </ProtectedRoute>
          )
        },
        {
          path: "admin-dashboard",
          element: (
             <ProtectedRoute allowedRole={["ADMIN"]}>
               <AdminDashboard />
             </ProtectedRoute>
          )
        },
        {
          path: "article/:articleId",
          element: (
             <ProtectedRoute>
               <Article />
             </ProtectedRoute>
          )
        },
        {
          path: "edit-article/:articleId",
          element: (
             <ProtectedRoute allowedRole="AUTHOR">
               <EditArticle />
             </ProtectedRoute>
          )
        }
      ]
    }
  ]);

  return (
    <div className="bg-white min-h-screen text-[#1d1d1f]">
      <Toaster />
      <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;
