import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  pageBackground, pageWrapper, formCard, formTitle, labelClass, inputClass,
  formGroup, submitBtn, ghostBtn
} from '../styles/common';

const EditArticle = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await axios.get(`${apiUrl}/user-api/articles/${articleId}`, { withCredentials: true });
        const article = res.data.payload;
        reset({
          title: article.title,
          category: article.category,
          content: article.content
        });
      } catch (err) {
        toast.error("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [articleId, reset]);

  const onSubmit = async (data) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const payload = {
        articleId,
        ...data,
        author: currentUser?._id || currentUser?.userId
      };
      await axios.put(`${apiUrl}/author-api/articles/`, payload, { withCredentials: true });
      toast.success('Updated successfully!');
      navigate('/author-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  };

  if (loading) return <div className={pageBackground}><div className={pageWrapper}><p className="text-center animate-pulse">Loading...</p></div></div>;

  return (
    <div className={pageBackground + " py-20"}>
      <div className={formCard}>
        <h2 className={formTitle}>Edit Article</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input 
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters long' }
              })} 
              className={inputClass} 
            />
            {errors.title && <p className="text-[#cc2f26] text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Category</label>
            <select 
              {...register('category', { required: 'Category is required' })} 
              className={inputClass}
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
            </select>
            {errors.category && <p className="text-[#cc2f26] text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea 
              {...register('content', { 
                required: 'Content is required',
                minLength: { value: 10, message: 'Content must be at least 10 characters long' }
              })} 
              className={inputClass + " h-64 resize-none"} 
            />
            {errors.content && <p className="text-[#cc2f26] text-xs mt-1">{errors.content.message}</p>}
          </div>

          <button type="submit" className={submitBtn}>Save Changes</button>
          <button type="button" onClick={() => navigate(-1)} className={ghostBtn + " w-full mt-4"}>Cancel</button>
        </form>
      </div>
    </div>
  );
};
export default EditArticle;
