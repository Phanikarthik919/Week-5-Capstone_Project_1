import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  pageBackground, formCard, formTitle, labelClass, inputClass,
  formGroup, submitBtn, linkClass, errorClass, mutedText, loadingClass
} from '../styles/common';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onUserRegister = async (newUser) => {
    console.log(newUser);
    setLoading(true);
    setError(null);
    try {
      let { role, ...userObj } = newUser;

      if (role === "user") {
        //make api request to user api
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        let res = await axios.post(`${apiUrl}/user-api/users`, userObj);
        console.log("res obj is ", res);
        if (res.status === 201) {
          setLoading(false);
          toast.success("Registration successful! Please login.");
          //navigate to login 
          navigate("/login");
        }
      }
      if (role === "author") {
        //make api request to author api
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        let res = await axios.post(`${apiUrl}/author-api/users`, userObj);
        console.log("res obj is ", res);
        if (res.status === 201) {
          setLoading(false);
          toast.success("Author registration successful! Please login.");
          //navigate to login 
          navigate("/login");
        }
      }
    } catch (err) {
      console.log("err is ", err);
      const errMsg = err.response?.data?.error || err.message;
      setError(errMsg);
      toast.error(errMsg);
      setLoading(false);
    }
  }


  return (
    <div className={pageBackground + " flex items-center justify-center px-4 py-16"}>
      <div className={formCard}>
        <h2 className={formTitle}>Create Account</h2>

        {/* Error message at top of form */}
        {error && <p className={errorClass + " mb-4"}>Error: {error}</p>}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* Role Selection */}
          <div className={formGroup}>
            <label className={labelClass}>Account Type</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="user" {...register('role', { required: 'Select a role' })} className="accent-[#0066cc]" />
                <span className="text-sm text-[#1d1d1f]">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="author" {...register('role', { required: 'Select a role' })} className="accent-[#0066cc]" />
                <span className="text-sm text-[#1d1d1f]">Author</span>
              </label>
            </div>
            {errors.role && <p className="text-[#cc2f26] text-xs mt-1">{errors.role.message}</p>}
          </div>

          {/* First Name & Last Name */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                {...register('firstName', { required: 'First name is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
                type="text"
                placeholder="John"
                className={inputClass}
              />
              {errors.firstName && <p className="text-[#cc2f26] text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                type="text"
                placeholder="Doe"
                className={inputClass}
              />
              {errors.lastName && <p className="text-[#cc2f26] text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
              type="email"
              placeholder="name@example.com"
              className={inputClass}
            />
            {errors.email && <p className="text-[#cc2f26] text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' } })}
              type="password"
              placeholder="••••••••"
              className={inputClass}
            />
            {errors.password && <p className="text-[#cc2f26] text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Profile Image URL */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image URL</label>
            <input
              {...register('profileImageUrl')}
              type="text"
              placeholder="https://example.com/photo.jpg"
              className={inputClass}
            />
          </div>

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className={mutedText + " text-center mt-5"}>
            Already have an account? <Link to="/login" className={linkClass}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
