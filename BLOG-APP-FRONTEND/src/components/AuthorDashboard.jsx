import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText, mutedText,
  cardClass, headingClass, primaryBtn, secondaryBtn, ghostBtn,
  articleCardClass, articleTitle, articleMeta, articleGrid, divider, loadingClass
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

  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        // Fetching articles specifically for this author using their ID
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

        {loading ? (
          <p className={loadingClass}>Loading your articles...</p>
        ) : articles.length > 0 ? (
          <div className={articleGrid}>
            {articles.map((article) => (
              <div key={article._id} className={articleCardClass}>
                <div className="flex flex-col h-full">
                  <div className="mb-auto">
                    <span className="text-[0.6rem] font-bold text-[#0066cc] uppercase tracking-wider mb-2 block">{article.category}</span>
                    <h2 className={articleTitle}>{article.title}</h2>
                    <p className="text-xs text-[#a1a1a6] mt-1 mb-3">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-[#6e6e73] line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="text-[0.7rem] font-semibold text-[#0066cc] hover:underline">Edit</button>
                    <button className="text-[0.7rem] font-semibold text-[#ff3b30] hover:underline">Deactivate</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cardClass + " text-center py-20"}>
            <p className={mutedText}>You haven't published any articles yet.</p>
            <Link to="/add-article" className={ghostBtn + " mt-4 inline-block"}>Create your first post</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;
