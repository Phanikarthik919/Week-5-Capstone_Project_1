import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import Articles from './Articles';
import ConfirmModal from './ConfirmModal';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText,
  primaryBtn, secondaryBtn
} from '../styles/common';

const AuthorDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "primary",
    confirmText: "Confirm",
    action: null,
    article: null
  });

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

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEdit = (article) => {
    navigate(`/edit-article/${article._id}`);
  };

  const openDeleteModal = (article) => {
    setModalConfig({
      isOpen: true,
      title: "Deactivate Article",
      message: `Are you sure you want to deactivate "${article.title}"? It will be moved to the deactivated section.`,
      type: "danger",
      confirmText: "Deactivate",
      action: "deactivate",
      article
    });
  };

  const openActivateModal = (article) => {
    setModalConfig({
      isOpen: true,
      title: "Activate Article",
      message: `Are you sure you want to activate "${article.title}"? It will be visible to everyone again.`,
      type: "primary",
      confirmText: "Activate",
      action: "activate",
      article
    });
  };

  const handleConfirmAction = async () => {
    const { action, article } = modalConfig;
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    
    try {
      if (action === "deactivate") {
        await axios.put(`${apiUrl}/author-api/articles/deactivate`, {
          article_id: article._id,
          author: currentUser._id
        }, { withCredentials: true });
        
        setArticles(prev => prev.map(a => 
          a._id === article._id ? { ...a, isArticleActive: false } : a
        ));
      } else if (action === "activate") {
        await axios.put(`${apiUrl}/author-api/articles/activate`, {
          article_id: article._id,
          author: currentUser._id
        }, { withCredentials: true });
        
        setArticles(prev => prev.map(a => 
          a._id === article._id ? { ...a, isArticleActive: true } : a
        ));
      }
    } catch (err) {
      console.error(`Error ${action}ing article:`, err);
    } finally {
      closeModal();
    }
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleReadMore = (article) => {
    navigate(`/article/${article._id}`, { state: article });
  };

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className={pageTitleClass}>My Dashboard</h1>
            <p className={bodyText}>Welcome back, {currentUser?.firstName || 'Author'}. Manage your work here.</p>
          </div>
          <div className="flex items-center gap-4">
            {currentUser?.profileImageUrl && (
              <img 
                src={currentUser.profileImageUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
            )}
            <Link to="/add-article" className={primaryBtn}>
              Write New Article
            </Link>
            <button onClick={onLogout} className={secondaryBtn}>
              Logout
            </button>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-[#1d1d1f] border-b pb-2">My Active Articles</h2>
          <Articles
            articles={articles.filter(a => a.isArticleActive)}
            loading={loading}
            showActions={true}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onReadMore={handleReadMore}
            emptyMessage="You don't have any active articles."
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 text-[#ff3b30] border-b pb-2">Deactivated Articles</h2>
          <Articles
            articles={articles.filter(a => !a.isArticleActive)}
            loading={loading}
            showActions={true}
            onActivate={openActivateModal}
            onReadMore={handleReadMore}
            emptyMessage="No deactivated articles."
          />
        </div>
      </div>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        onConfirm={handleConfirmAction}
        onCancel={closeModal}
      />
    </div>
  );
};

export default AuthorDashboard;
