import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  pageBackground, formCard, formTitle, labelClass, inputClass,
  formGroup, submitBtn, ghostBtn
} from '../styles/common';

const EditArticle = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // Fetch article data on mount to populate the form
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        // We can fetch via the public/user API to grab the data
        const res = await axios.get(`${apiUrl}/user-api/articles/${articleId}`, { withCredentials: true });
        const article = res.data.payload;

        // Populate the react-hook-form with the existing article data
        reset({
          title: article.title,
          category: article.category,
          content: article.content
        });
      } catch (err) {
        console.error("Error fetching article info:", err);
        toast.error("Failed to fetch article details");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, reset]);

  const onSubmit = async (data) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const updatePayload = {
        articleId: articleId,
        title: data.title,
        category: data.category,
        content: data.content,
        // Backend's checkAuthor logic expects the 'author' field to be sent in the body
        author: currentUser?.userId || currentUser?._id
      };

      await axios.put(`${apiUrl}/author-api/articles/`, updatePayload, { withCredentials: true });

      toast.success('Article updated successfully!');
      navigate('/author-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update article');
    }
  };

  if (loading) {
    return (
      <div className={pageBackground + " flex items-center justify-center px-4 py-16"}>
        <p className="text-[#0066cc]/60 animate-pulse">Loading article data...</p>
      </div>
    );
  }

  return (
    <div className={pageBackground + " flex items-center justify-center px-4 py-16"}>
      <div className={formCard + " max-w-lg w-full"}>
        <h2 className={formTitle}>Edit Article</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              placeholder="Article title"
              className={inputClass}
            />
            {errors.title && <p className="text-[#cc2f26] text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={inputClass + " appearance-none cursor-pointer"}
            >
              <option value="" disabled>Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
              {/* Ensure standard lowercase handling or specific exact names match the options previously used */}
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="business">Business</option>
            </select>
            {errors.category && <p className="text-[#cc2f26] text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Content */}
          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              placeholder="Write your article..."
              rows="6"
              className={inputClass + " resize-none"}
            ></textarea>
            {errors.content && <p className="text-[#cc2f26] text-xs mt-1">{errors.content.message}</p>}
          </div>

          <button type="submit" className={submitBtn}>
            Update Article
          </button>

          <div className="text-center mt-4">
            <button type="button" onClick={() => navigate(-1)} className={ghostBtn}>
              ← Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;
