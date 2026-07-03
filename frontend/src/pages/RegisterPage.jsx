import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { registerUser } from '../store/slices/authSlice';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({
      name: data.name, email: data.email, password: data.password, phone: data.phone
    }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <>
      <Helmet><title>Create Account — Silverkaari</title></Helmet>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gold-600 flex items-center justify-center text-white text-2xl font-serif mx-auto mb-4">S</div>
            <h1 className="font-serif text-3xl text-white">Join Silverkaari</h1>
            <p className="text-silver-500 mt-2">Create your account and start shopping</p>
          </div>

          <div className="card p-8 space-y-5">
            <button
              onClick={() => { window.location.href = '/api/auth/google'; }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-dark-600 border border-white/10 rounded-xl text-white font-medium hover:bg-dark-500 transition-all"
            >
              <FcGoogle size={22} />
              Sign up with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-silver-700 text-xs">or with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {error && <div className="bg-red-900/20 border border-red-700/30 text-red-400 text-sm p-3 rounded-xl">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="input-label">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                    className="input pl-10" placeholder="Your full name" />
                </div>
                {errors.name && <p className="input-error">{errors.name.message}</p>}
              </div>

              <div>
                <label className="input-label">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input type="email" {...register('email', { required: 'Email is required' })}
                    className="input pl-10" placeholder="you@example.com" />
                </div>
                {errors.email && <p className="input-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="input-label">Phone (optional)</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input {...register('phone', { pattern: { value: /^[6-9][0-9]{9}$/, message: 'Invalid phone number' } })}
                    className="input pl-10" placeholder="10-digit mobile" />
                </div>
                {errors.phone && <p className="input-error">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="input-label">Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Must include upper, lower, and number' }
                    })}
                    className="input pl-10" placeholder="Min 8 characters" />
                </div>
                {errors.password && <p className="input-error">{errors.password.message}</p>}
              </div>

              <div>
                <label className="input-label">Confirm Password *</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-600" size={16} />
                  <input type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: val => val === password || 'Passwords do not match'
                    })}
                    className="input pl-10" placeholder="Repeat password" />
                </div>
                {errors.confirmPassword && <p className="input-error">{errors.confirmPassword.message}</p>}
              </div>

              <p className="text-silver-700 text-xs">
                By creating an account, you agree to our{' '}
                <Link to="#" className="text-gold-600 hover:text-gold-400">Terms of Service</Link> and{' '}
                <Link to="#" className="text-gold-600 hover:text-gold-400">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-silver-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
