import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
      <div className="page-container py-10">
        <h1 className="font-serif text-4xl text-white mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-700 to-gold-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : getInitials(user?.name)}
              </div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-silver-600 text-sm">{user?.email}</p>
              <span className={`badge mt-2 ${user?.role === 'admin' ? 'badge-gold' : 'badge-silver'}`}>
                {user?.role}
              </span>
            </div>

            <nav className="mt-4 space-y-1">
              {['profile', 'security'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${
                    tab === t ? 'bg-gold-600/20 text-gold-400' : 'text-silver-400 hover:text-white hover:bg-white/5'
                  }`}>
                  {t === 'profile' ? '👤 Profile Info' : '🔒 Security'}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === 'profile' && (
              <form onSubmit={handleSubmit(onProfileSubmit)} className="card p-6 space-y-5">
                <h2 className="font-serif text-2xl text-white">Profile Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input {...register('name', { required: 'Name is required' })} className="input" />
                    {errors.name && <p className="input-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">Phone</label>
                    <input {...register('phone')} className="input" placeholder="10-digit number" />
                  </div>
                </div>

                <div>
                  <label className="input-label">Street Address</label>
                  <input {...register('address.street')} className="input" placeholder="House/Flat No., Street" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">City</label>
                    <input {...register('address.city')} className="input" />
                  </div>
                  <div>
                    <label className="input-label">State</label>
                    <select {...register('address.state')} className="input">
                      <option value="">Select State</option>
                      {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Pincode</label>
                    <input {...register('address.pincode')} className="input" maxLength={6} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={!isDirty} className="btn-primary">Save Changes</button>
                  <button type="button" onClick={() => reset()} disabled={!isDirty} className="btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            {tab === 'security' && (
              <form onSubmit={handlePwd(onChangePassword)} className="card p-6 space-y-5">
                <h2 className="font-serif text-2xl text-white">Change Password</h2>

                {!user?.password && !user?.googleId ? null : user?.googleId && !user?.password ? (
                  <div className="p-4 bg-blue-900/20 border border-blue-700/30 rounded-xl">
                    <p className="text-blue-400 text-sm">You signed in with Google. Use the "Forgot Password" flow to set a password for email login.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="input-label">Current Password *</label>
                      <input type="password" {...regPwd('currentPassword', { required: 'Required' })} className="input" />
                      {pwdErrors.currentPassword && <p className="input-error">{pwdErrors.currentPassword.message}</p>}
                    </div>
                    <div>
                      <label className="input-label">New Password *</label>
                      <input type="password" {...regPwd('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} className="input" />
                      {pwdErrors.newPassword && <p className="input-error">{pwdErrors.newPassword.message}</p>}
                    </div>
                    <div>
                      <label className="input-label">Confirm New Password *</label>
                      <input type="password" {...regPwd('confirmPassword', { required: 'Required' })} className="input" />
                    </div>
                    <button type="submit" disabled={changingPassword} className="btn-primary">
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
