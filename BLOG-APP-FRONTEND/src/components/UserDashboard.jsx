import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import Articles from './Articles';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText,
  primaryBtn, secondaryBtn
} from '../styles/common';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/user-api/articles`, { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        console.log("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchArticles();
    }
  }, [currentUser]);

  const onLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleReadMore = (article) => {
    console.log("Read more:", article._id);
    // navigate(`/article/${article._id}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <button onClick={() => navigate('/login')} className={primaryBtn}>
          Please Login
        </button>
      </div>
    );
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        {/* Welcome Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className={pageTitleClass}>
              👋 Welcome, <span className="text-[#0066cc]">{currentUser?.firstName}</span>
            </h1>
            <p className={bodyText + " mt-2"}>Explore the latest publications from our authors.</p>
          </div>
          <button onClick={onLogout} className={secondaryBtn}>
            Logout
          </button>
        </div>

        {/* Articles Grid */}
        <Articles
          articles={articles}
          loading={loading}
          onReadMore={handleReadMore}
          emptyMessage="No articles have been published yet."
        />
      </div>
    </div>
  );
};

export default UserDashboard;