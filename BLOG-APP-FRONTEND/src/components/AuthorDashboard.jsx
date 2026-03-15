import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import Articles from './Articles';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText,
  primaryBtn, secondaryBtn
} from '../styles/common';

const AuthorDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEdit = (article) => {
    console.log("Edit article:", article._id);
    // navigate(`/edit-article/${article._id}`);
  };

  const handleDelete = (article) => {
    console.log("Delete article:", article._id);
    // handle delete logic
  };

  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/author-api/articles/${currentUser._id}`, { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        console.log("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchArticles();
    }
  }, [currentUser]);

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className={pageTitleClass}>My Dashboard</h1>
            <p className={bodyText}>Welcome back, {currentUser?.firstName || 'Author'}. Here are your latest publications.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/add-article" className={primaryBtn}>
              Write New Article
            </Link>
            <button onClick={onLogout} className={secondaryBtn}>
              Logout
            </button>
          </div>
        </div>

        <Articles
          articles={articles}
          loading={loading}
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="You haven't published any articles yet."
        />
      </div>
    </div>
  );
};

export default AuthorDashboard;
