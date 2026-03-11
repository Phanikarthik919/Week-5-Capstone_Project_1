import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import axios from 'axios';
import { submitBtn } from '../styles/common'
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();



  // Fetch articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user-api/articles", { withCredentials: true });
        setArticles(res.data.payload);
      } catch (err) {
        console.log("Error fetching articles:", err);
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

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Please Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              👋 Welcome, <span className="text-blue-600">{currentUser?.firstName}</span>
            </h1>
            <p className="mt-1 text-gray-500">Explore the latest articles from all authors.</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-medium transition-all"
          >
            Logout
          </button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-8 p-5">
          {articles.map((article) => (
            <div key={article._id} className="border-2 p-5 bg-white flex flex-col justify-between">
              <div>
                <span className="text-blue-500 font-semibold uppercase text-xs">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold mt-1">
                  {article.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {article.content}
                </p>
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-gray-400">Date Published</h4>
                  <p className="text-sm text-gray-500">{article.createdAt}</p>
                </div>
              </div>
              <button className={submitBtn + " mt-4 font-bold"}>
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;