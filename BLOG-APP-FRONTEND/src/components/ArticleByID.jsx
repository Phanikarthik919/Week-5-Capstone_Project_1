import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import {
  pageBackground, pageWrapper, pageTitleClass, bodyText, mutedText,
  cardClass, headingClass, primaryBtn, secondaryBtn, ghostBtn, divider, 
  formGroup, labelClass, inputClass, submitBtn
} from '../styles/common';
import toast from 'react-hot-toast';

const ArticleByID = () => {
  const { state } = useLocation();
  const { articleId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);
  
  // Comment state
  const [commentText, setCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    // If article was not passed via state, fetch it from backend
    if (!state) {
      const fetchArticle = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
          const res = await axios.get(`${apiUrl}/user-api/articles/${articleId}`, { withCredentials: true });
          setArticle(res.data.payload);
        } catch (err) {
          console.error("Error fetching article:", err);
          setError("Failed to load article.");
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [articleId, state]);

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
      
      // Update local article state with the new comment
      setArticle(res.data.payload);
      setCommentText("");
      toast.success("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error(err.response?.data?.message || "Failed to add comment.");
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) {
    return (
      <div className={pageBackground}>
        <div className={pageWrapper + " text-center"}>
          <p className="text-[#0066cc]/60 animate-pulse">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={pageBackground}>
        <div className={pageWrapper + " text-center"}>
          <p className="text-[#cc2f26]">{error || "Article not found."}</p>
          <button onClick={() => navigate(-1)} className={ghostBtn + " mt-4"}>&larr; Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageBackground}>
      <div className={pageWrapper}>
        <button onClick={() => navigate(-1)} className={ghostBtn + " mb-8 flex items-center gap-2"}>
          &larr; Back to Dashboard
        </button>
        
        {/* Article Header */}
        <div className="mb-10">
          <span className="text-sm font-bold text-[#0066cc] uppercase tracking-wider mb-3 block">
            {article.category}
          </span>
          <h1 className={pageTitleClass + " mb-4"}>{article.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#a1a1a6] text-sm mt-4">
            <p>By <span className="font-semibold text-[#1d1d1f]">
              {typeof article.author === 'object' 
                ? `${article.author.firstName} ${article.author.lastName || ''}`.trim() 
                : "Author"}
            </span></p>
            <p>&bull;</p>
            <p>Published: {new Date(article.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</p>
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <>
                <p>&bull;</p>
                <p>Modified: {new Date(article.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</p>
              </>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#e8e8ed] mb-12">
          <p className="text-[#1d1d1f] text-lg leading-[1.8] whitespace-pre-wrap">
            {article.content}
          </p>
        </div>

        <div className={divider}></div>

        {/* Comments Section */}
        <div className="max-w-3xl">
          <h2 className={headingClass + " mb-8"}>Comments ({article.comments?.length || 0})</h2>
          
          {/* Add Comment */}
          {currentUser && currentUser.role === "USER" && (
            <form onSubmit={handleAddComment} className="mb-10 bg-[#f5f5f7] p-6 rounded-2xl">
              <div className={formGroup + " mb-3"}>
                <label className={labelClass}>Add a comment</label>
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={inputClass + " resize-none h-24"}
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={addingComment || !commentText.trim()}
                  className={primaryBtn + (addingComment ? " opacity-70" : "")}
                >
                  {addingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {!article.comments || article.comments.length === 0 ? (
              <p className={mutedText}>No comments yet. Be the first to share your thoughts!</p>
            ) : (
              article.comments.map((comment, index) => (
                <div key={index} className="flex gap-4 p-5 rounded-2xl border border-[#e8e8ed] bg-white">
                  <div className="w-10 h-10 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold text-lg shrink-0">
                    {comment.username ? comment.username[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1d1d1f] mb-1">
                      {comment.username || "User"}
                    </p>
                    <p className="text-[#424245] text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleByID;
