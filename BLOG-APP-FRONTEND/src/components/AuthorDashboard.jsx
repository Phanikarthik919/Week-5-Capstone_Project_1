import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText, mutedText,
  cardClass, headingClass, primaryBtn, secondaryBtn, ghostBtn,
  articleCardClass, articleTitle, articleMeta, articleGrid, divider
} from '../styles/common';

const AuthorDashboard = () => {

  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
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
      }
    };

    if (currentUser) {
      fetchArticles();
    }
  }, [currentUser]);

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <p>
          
        </p>
      </div>
    </div>
  );
};

export default AuthorDashboard;
