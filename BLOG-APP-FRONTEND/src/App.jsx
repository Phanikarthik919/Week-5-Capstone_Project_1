import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AddArticle from './components/AddArticle';
import UserDashboard from './components/UserDashboard';
import AuthorDashboard from './components/AuthorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen text-[#1d1d1f]">
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-article" element={<AddArticle />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/author-dashboard" element={<AuthorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


