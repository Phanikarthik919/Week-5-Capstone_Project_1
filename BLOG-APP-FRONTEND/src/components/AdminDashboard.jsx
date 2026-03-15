import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import Articles from './Articles';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText, mutedText,
  cardClass, headingClass, primaryBtn, secondaryBtn, divider
} from '../styles/common';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        // Admins can see all articles (you might want a specific admin endpoint later)
        const res = await axios.get(`${apiUrl}/user-api/articles`, { withCredentials: true });
        setArticles(res.data.payload.slice(0, 4)); // Show only recent 4
      } catch (err) {
        console.log("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className={pageTitleClass}>Admin Panel</h1>
            <p className={bodyText + " mt-2"}>Managing {articles.length * 10}+ users · {articles.length} pending</p>
          </div>
          <div className="flex gap-4">
            <button className={primaryBtn}>Send Announcement</button>
            <button onClick={onLogout} className={secondaryBtn}>Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { label: 'Total Users', val: '342' },
            { label: 'Authors', val: '48' },
            { label: 'Articles', val: articles.length },
            { label: 'Pending', val: '18' },
          ].map((stat) => (
            <div key={stat.label} className={cardClass + " text-center"}>
              <p className={mutedText + " mb-1"}>{stat.label}</p>
              <p className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className={divider}></div>

        {/* Recent Articles */}
        <div>
          <h2 className={headingClass + " mb-6"}>Recent Activity</h2>
          <Articles
            articles={articles}
            loading={loading}
            showActions={true}
            onEdit={(a) => console.log("Mod edit:", a._id)}
            onDelete={(a) => console.log("Mod delete:", a._id)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
