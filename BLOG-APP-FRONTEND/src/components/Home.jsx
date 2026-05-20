import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import axios from 'axios';
import Articles from './Articles';
import { pageBackground, pageWrapper, pageTitleClass, bodyText, primaryBtn } from '../styles/common';

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "USER") {
        navigate("/user-dashboard");
      } else if (currentUser.role === "ADMIN") {
        navigate("/admin-dashboard");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    const fetchArticles = async () => {
      if (isAuthenticated && currentUser?.role === "AUTHOR") {
        try {
          setLoading(true);
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
          const res = await axios.get(`${apiUrl}/user-api/articles`, { withCredentials: true });
          setArticles(res.data.payload);
        } catch (err) {
          console.error("Error fetching articles:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchArticles();
  }, [isAuthenticated, currentUser]);

  const handleReadMore = (article) => {
    navigate(`/article/${article._id}`, { state: article });
  };

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        {isAuthenticated && currentUser?.role === "AUTHOR" ? (
          <>
            <div className="mb-10">
              <h1 className={pageTitleClass}>Global Feed</h1>
              <p className={bodyText}>Explore articles from the community.</p>
            </div>
            <Articles 
              articles={articles} 
              loading={loading} 
              onReadMore={handleReadMore} 
              emptyMessage="No articles found in the feed."
            />
          </>
        ) : (
          <div className="text-center py-20">
            <h1 className={pageTitleClass + " mb-4"}>Welcome to BlogApp</h1>
            <p className={bodyText + " max-w-lg mx-auto mb-10"}>
              Join our community and start sharing your thoughts. Read insightful articles from authors around the world.
            </p>
            {!isAuthenticated && (
              <Link to="/login">
                <button className={primaryBtn + " px-8 py-3 text-base"}>
                  Get Started
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
