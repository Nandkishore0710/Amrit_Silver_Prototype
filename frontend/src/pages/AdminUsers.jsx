import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { formatDate, getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { FiTrash2 } from 'react-icons/fi';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, roleFilter, page],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: { search, role: roleFilter, page, limit: 20 } });
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }) => api.put(`/admin/users/${id}`, updates),
    onSuccess: () => { toast.success('User updated'); queryClient.invalidateQueries(['admin-users']); },
    onError: () => toast.error('Failed to update user')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { toast.success('User deleted'); queryClient.invalidateQueries(['admin-users']); },
    onError: () => toast.error('Failed to delete user')
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Helmet><title>Users — Admin | Silverkaari</title></Helmet>
      <div className="flex h-screen bg-dark-900">
        <aside className="w-60 bg-dark-950 border-r border-white/[0.04] flex flex-col p-4">
          <div className="mb-6"><p className="text-white font-semibold text-sm">Silverkaari Admin</p></div>
          {[
            { to: '/admin', label: '📊 Dashboard' },
            { to: '/admin/products', label: '🛍️ Products' },
            { to: '/admin/orders', label: '📦 Orders' },
            { to: '/admin/users', label: '👥 Users', active: true }
          ].map(item => (
            <a key={item.to} href={item.to}
              className={clsx('flex items-center px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors',
                item.active ? 'bg-gold-600/20 text-gold-400' : 'text-silver-500 hover:text-white hover:bg-white/5')}>
              {item.label}
            </a>
          ))}
        </aside>

        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="font-serif text-3xl text-white mb-8">Users</h1>

          <div className="flex gap-3 mb-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..." className="input text-sm max-w-[240px]" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="input text-sm max-w-[150px]">
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="artisan">Artisan</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="card overflow-hidden">
            {isLoading ? (
              <div className="py-20 text-center text-silver-600">Loading...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['User', 'Role', 'Status', 'Orders', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-silver-600 text-xs uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{user.name}</p>
                            <p className="text-silver-600 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateMutation.mutate({ id: user._id, role: e.target.value })}
                          className={clsx('input text-xs py-1 px-2 min-w-[110px]',
                            user.role === 'admin' ? 'text-gold-400' :
                            user.role === 'artisan' ? 'text-purple-400' : 'text-silver-400')}
                        >
                          <option value="customer">Customer</option>
                          <option value="artisan">Artisan</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateMutation.mutate({ id: user._id, isActive: !user.isActive })}
                          className={clsx('badge text-xs cursor-pointer transition-colors',
                            user.isActive ? 'badge-success hover:bg-red-900/30 hover:text-red-400' : 'badge-danger hover:bg-green-900/30 hover:text-green-400')}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-silver-400 text-sm">{user.orderCount || 0}</td>
                      <td className="px-4 py-3 text-silver-600 text-sm">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${user.name}? This cannot be undone.`)) {
                              deleteMutation.mutate(user._id);
                            }
                          }}
                          disabled={user.role === 'admin'}
                          className="p-1.5 text-silver-600 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-silver-600">No users found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {pagination?.pages > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-9 h-9 rounded-lg text-sm', p === page ? 'bg-gold-600 text-white' : 'border border-white/10 text-silver-400')}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
