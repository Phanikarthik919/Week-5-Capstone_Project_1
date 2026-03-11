import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  pageBackground, formCard, formTitle, labelClass, inputClass,
  formGroup, submitBtn, linkClass, errorClass, mutedText
} from '../styles/common';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Get state and actions from auth store
  const login = useAuth((state) => state.login);
  const loading = useAuth((state) => state.loading);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const error = useAuth((state) => state.error);

  // When login succeeds, navigate based on role
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    console.log("currentUser:", currentUser);
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "USER") {
        navigate("/user-dashboard");
      }
      if (currentUser.role === "AUTHOR") {
        navigate("/author-dashboard");
      }
      if (currentUser.role === "ADMIN") {
        navigate("/admin-dashboard");
      }
    }
  }, [isAuthenticated, currentUser]);

  // Form submit handler
  const onUserLogin = async (userCredObj) => {
    const promise = login(userCredObj);
    toast.promise(promise, {
      loading: 'Signing in...',
      success: (data) => `Welcome back!`,
      error: (err) => `Login failed: ${err}`
    });
    await promise;
  };

  return (
    <div className={pageBackground + " flex items-center justify-center px-4 py-16"}>
      <div className={formCard + " w-full max-w-2xl"}>
        <h2 className={formTitle}>Sign In</h2>

        {/* Error message at top of form */}
        {error && <p className={errorClass + " mb-4"}>Error: {error}</p>}

        <form onSubmit={handleSubmit(onUserLogin)}>
          

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input
              {...register('email', { required: 'Email is required' })}
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
              {...register('password', { required: 'Password is required' })}
              type="password"
              placeholder="••••••••"
              className={inputClass}
            />
            {errors.password && <p className="text-[#cc2f26] text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className={submitBtn} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className={mutedText + " text-center mt-5"}>
            Don't have an account? <Link to="/register" className={linkClass}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
