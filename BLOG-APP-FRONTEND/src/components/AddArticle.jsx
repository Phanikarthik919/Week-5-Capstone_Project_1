import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../store/authStore';
import {
  pageBackground, formCard, formTitle, labelClass, inputClass,
  formGroup, submitBtn, ghostBtn
} from '../styles/common';

const AddArticle = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      
      const payload = {
        ...data,
        author: currentUser._id
      };
      
      const res = await axios.post(`${apiUrl}/author-api/articles`, payload, {
        withCredentials: true
      });
      
      if(res.status === 201) {
        toast.success("Article published successfully!");
        navigate("/author-dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageBackground + " flex items-center justify-center px-4 py-16"}>
      <div className={formCard + " w-full max-w-lg"}>
        <h2 className={formTitle}>New Article</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
          <div className={formGroup}>
            <label className={labelClass}>Title</label>
            <input
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 5, message: 'Title must be at least 5 characters long' }
              })}
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
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
            </select>
            {errors.category && <p className="text-[#cc2f26] text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Content */}
          <div className={formGroup}>
            <label className={labelClass}>Content</label>
            <textarea
              {...register('content', { 
                required: 'Content is required',
                minLength: { value: 10, message: 'Content must be at least 10 characters long' }
              })}
              placeholder="Write your article..."
              rows="6"
              className={inputClass + " resize-none"}
            ></textarea>
            {errors.content && <p className="text-[#cc2f26] text-xs mt-1">{errors.content.message}</p>}
          </div>

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Article'}
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

export default AddArticle;
