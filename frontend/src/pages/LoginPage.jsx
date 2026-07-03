import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../store/slices/authSlice';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <>
      <Helmet><title>Sign In — Silverkaari</title></Helmet>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gold-600 flex items-center justify-center text-white text-2xl font-serif mx-auto mb-4">S</div>
            <h1 className="font-serif text-3xl text-white">Welcome Back</h1>
            <p className="text-silver-500 mt-2">Sign in to your Silverkaari account</p>
          </div>

          <div className="card p-8 space-y-5">
            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              id="google-login-btn"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-dark-600 border border-white/10 rounded-xl text-white font-medium hover:bg-dark-500 hover:border-white/20 transition-all"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-silver-700 text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-700/30 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="input pl-10"
                    placeholder="you@example.com"
                    id="login-email"
                  />
                </div>
                {errors.email && <p className="input-error">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="input-label mb-0">Password</label>
                  <Link to="/forgot-password" className="text-xs text-gold-600 hover:text-gold-400 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="input pl-10"
                    placeholder="••••••••"
                    id="login-password"
                  />
                </div>
                {errors.password && <p className="input-error">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} id="login-submit" className="btn-primary w-full justify-center py-3 text-base">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-silver-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
