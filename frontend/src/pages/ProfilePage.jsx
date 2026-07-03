import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../store/slices/authSlice';
import { INDIA_STATES } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../api';

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('profile');
  const [changingPassword, setChangingPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      'address.street': user?.address?.street || '',
      'address.city': user?.address?.city || '',
      'address.state': user?.address?.state || '',
      'address.pincode': user?.address?.pincode || ''
    }
  });

  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm();

  const onProfileSubmit = async (data) => {
    const address = {
      street: data['address.street'],
      city: data['address.city'],
      state: data['address.state'],
      pincode: data['address.pincode'],
      country: 'India'
    };
    const result = await dispatch(updateProfile({ name: data.name, phone: data.phone, address }));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      reset(data);
    } else {
      toast.error('Failed to update profile');
    }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      await api.put('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <>
      <Helmet><title>My Profile — Silverkaari</title></Helmet>
      <div className="page-container py-10 bg-white min-h-screen">
        <h1 className="font-serif text-4xl text-[#1F1F1F] font-bold mb-8" style={{ fontFamily: 'Georgia, serif' }}>My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center bg-stone-50 border border-stone-200 shadow-sm rounded-lg">
              <div className="w-20 h-20 rounded-full bg-[#c8a97e] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : getInitials(user?.name)}
              </div>
              <p className="text-[#1F1F1F] font-bold">{user?.name}</p>
              <p className="text-stone-500 text-sm mb-2">{user?.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user?.role === 'admin' ? 'bg-[#c8a97e]/10 text-[#c8a97e] border border-[#c8a97e]/20' : 'bg-stone-200 text-stone-600'}`}>
                {user?.role}
              </span>
            </div>

            <nav className="mt-4 space-y-1">
              {user?.role === 'admin' && (
                <Link to="/admin" className="block w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100 mb-2">
                  🛡️ Admin Dashboard
                </Link>
              )}
              {['profile', 'security'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
                    tab === t ? 'bg-[#1F1F1F] text-white shadow-md' : 'text-stone-500 hover:text-[#1F1F1F] hover:bg-stone-100'
                  }`}>
                  {t === 'profile' ? '👤 Profile Info' : '🔒 Security'}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'profile' && (
              <form onSubmit={handleSubmit(onProfileSubmit)} className="card p-6 space-y-5 bg-stone-50 border border-stone-200 shadow-sm rounded-lg">
                <h2 className="font-serif text-2xl text-[#1F1F1F] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Profile Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Full Name *</label>
                    <input {...register('name', { required: 'Name is required' })} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Phone</label>
                    <input {...register('phone')} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" placeholder="10-digit number" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Street Address</label>
                  <input {...register('address.street')} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" placeholder="House/Flat No., Street" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">City</label>
                    <input {...register('address.city')} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">State</label>
                    <select {...register('address.state')} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm">
                      <option value="">Select State</option>
                      {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Pincode</label>
                    <input {...register('address.pincode')} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" maxLength={6} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={!isDirty} className="bg-black text-white hover:bg-[#c8a97e] font-bold uppercase tracking-wider transition-colors py-3 px-6 rounded shadow-lg disabled:opacity-50">Save Changes</button>
                  <button type="button" onClick={() => reset()} disabled={!isDirty} className="bg-stone-200 text-stone-700 hover:bg-stone-300 font-bold uppercase tracking-wider transition-colors py-3 px-6 rounded shadow-sm disabled:opacity-50">Cancel</button>
                </div>
              </form>
            )}

            {tab === 'security' && (
              <form onSubmit={handlePwd(onChangePassword)} className="card p-6 space-y-5 bg-stone-50 border border-stone-200 shadow-sm rounded-lg">
                <h2 className="font-serif text-2xl text-[#1F1F1F] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Change Password</h2>

                {!user?.password && !user?.googleId ? null : user?.googleId && !user?.password ? (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-sm font-medium">You signed in with Google. Use the "Forgot Password" flow to set a password for email login.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Current Password *</label>
                      <input type="password" {...regPwd('currentPassword', { required: 'Required' })} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" />
                      {pwdErrors.currentPassword && <p className="text-red-500 text-xs mt-1 font-medium">{pwdErrors.currentPassword.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">New Password *</label>
                      <input type="password" {...regPwd('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" />
                      {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1 font-medium">{pwdErrors.newPassword.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Confirm New Password *</label>
                      <input type="password" {...regPwd('confirmPassword', { required: 'Required' })} className="w-full bg-white border border-stone-200 text-[#1F1F1F] rounded px-4 py-3 text-sm focus:border-[#1F1F1F] focus:ring-1 focus:ring-[#1F1F1F] outline-none shadow-sm" />
                    </div>
                    <button type="submit" disabled={changingPassword} className="bg-black text-white hover:bg-[#c8a97e] font-bold uppercase tracking-wider transition-colors py-3 px-6 rounded shadow-lg disabled:opacity-50">
                      {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
