import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import {
  pageBackground, pageWrapper, pageTitleClass, mutedText,
  headingClass, primaryBtn, secondaryBtn, ghostBtn, divider, 
  formGroup, labelClass, inputClass
} from '../styles/common';
import toast from 'react-hot-toast';

const Article = () => {
  const { state } = useLocation();
  const { articleId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/user-api/articles/${articleId}`, { withCredentials: true });
        setArticle(res.data.payload);
      } catch (err) {
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setAddingComment(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const payload = {
        user: currentUser?.userId || currentUser?._id, 
        articleId: article._id,
        comment: commentText
      };
      const res = await axios.put(`${apiUrl}/user-api/articles/comments`, payload, { withCredentials: true });
      setArticle(res.data.payload);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
      toast.error("Failed to add comment.");
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) return <div className={pageBackground}><div className={pageWrapper}><p className="text-center animate-pulse">Loading...</p></div></div>;
  if (error || !article) return <div className={pageBackground}><div className={pageWrapper + " text-center"}><p className="text-red-500 mb-4">{error}</p><button onClick={() => navigate(-1)} className={primaryBtn}>Go Back</button></div></div>;

  const authorName = article.author?.firstName || "Author";
  
  // Extract IDs safely whether article.author is an object or a plain string
  const articleAuthorId = typeof article.author === 'object' ? article.author?._id : article.author;
  const currentUserId = currentUser?._id || currentUser?.userId;
  
  // Only users with the AUTHOR role who actually wrote the article should see "Edit"
  const isAuthor = currentUser?.role === "AUTHOR" && currentUserId === articleAuthorId;

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className={ghostBtn}>
            &larr; Back to Dashboard
          </button>
        </div>
        
        <div className="mb-10">
          <span className="text-sm font-bold text-[#0066cc] uppercase tracking-widest mb-3 block">{article.category}</span>
          <h1 className={pageTitleClass}>{article.title}</h1>
          <div className="flex gap-4 text-sm text-[#86868b] mt-4">
            <p>By <span className="font-semibold text-[#1d1d1f]">{authorName}</span></p>
            <span>&bull;</span>
            <p>Published: {new Date(article.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-[#f5f5f7] rounded-3xl p-8 md:p-12 mb-12 border border-[#d2d2d7]/30">
          <p className="text-[#1d1d1f] text-lg leading-relaxed whitespace-pre-wrap">{article.content}</p>
        </div>

        <div className={divider}></div>

        <div className="max-w-2xl">
          <h2 className={headingClass + " mb-8"}>Comments ({article.comments?.length || 0})</h2>
          
          {(currentUser?.role === "USER" || currentUser?.role === "AUTHOR") && (
            <form onSubmit={handleAddComment} className="mb-10 bg-[#f5f5f7] p-6 rounded-2xl">
              <div className={formGroup}>
                <label className={labelClass}>Add a comment</label>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={inputClass + " h-24"}
                  required
                />
              </div>
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={addingComment} className={primaryBtn}>Post</button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {article.comments?.map((c, i) => (
              <div key={i} className="p-5 rounded-xl border border-[#d2d2d7] bg-white flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {c.user?.profileImageUrl ? (
                    <img 
                      src={c.user.profileImageUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-bold uppercase">{c.user?.firstName?.charAt(0) || "U"}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">{c.user?.firstName || "User"}</p>
                  <p className="text-gray-700">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Article;
