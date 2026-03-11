import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  pageBackground, formCard, formTitle, labelClass, inputClass,
  formGroup, submitBtn, ghostBtn
} from '../styles/common';

const AddArticle = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Article Data:', data);
  };

  return (
    <div className={pageBackground + " flex items-center justify-center px-4 py-16"}>
      <div className={formCard + " max-w-lg"}>
        <h2 className={formTitle}>New Article</h2>

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
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option value="tech">Technology</option>
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
            Publish Article
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
