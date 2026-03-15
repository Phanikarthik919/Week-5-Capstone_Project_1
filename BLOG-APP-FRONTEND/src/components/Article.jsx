import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';

const Article = () => {
  const { state } = useLocation(); // Get article from the Read More click
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Basic component state
  const [article, setArticle] = useState(state);
  const [commentText, setCommentText] = useState("");

  // Function to add a comment
  const handleAddComment = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const res = await axios.put(`${apiUrl}/user-api/articles/comments`, {
        user: currentUser.userId || currentUser._id,
        articleId: article._id,
        comment: commentText
      }, { withCredentials: true });

      // Update the screen with the new comment data from backend
      setArticle(res.data.payload);
      setCommentText(""); // clear input box
      toast.success("Comment added!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to add comment.");
    }
  };

  // If there's no article data, just go back
  if (!article) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Get author name safely
  const authorName = typeof article.author === 'object'
    ? article.author.firstName
    : "Author";

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', cursor: 'pointer' }}
      >
        Go Back
      </button>

      {/* --- 1. Article Display Section --- */}
      <div>
        <p style={{ color: 'blue', fontWeight: 'bold' }}>Category: {article.category}</p>
        <h1 style={{ fontSize: '2em' }}>{article.title}</h1>

        <div style={{ color: 'gray', marginBottom: '20px' }}>
          <p>By {authorName}</p>
          <p>Published: {new Date(article.createdAt).toLocaleString()}</p>
        </div>

        <p style={{ fontSize: '1.2em', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {article.content}
        </p>
      </div>

      <hr style={{ margin: '40px 0' }} />

      {/* --- 2. Add Comment Section --- */}
      <div>
        <h3>Comments</h3>

        {/* Only show Add Comment box if the logged in person is a USER */}
        {currentUser && currentUser.role === "USER" && (
          <form onSubmit={handleAddComment} style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f9f9f9' }}>
            <label>Add a comment:</label>
            <br />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              rows="3"
              style={{ width: '100%', margin: '10px 0' }}
            />
            <br />
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white' }}>
              Post Comment
            </button>
          </form>
        )}

        {/* --- 3. Displaying the Comments List --- */}
        <div>
          {(!article.comments || article.comments.length === 0) ? (
            <p>No comments yet.</p>
          ) : (
            article.comments.map((comment, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <p><strong>{comment.username || "User"}</strong></p>
                <p>{comment.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

export default Article;
