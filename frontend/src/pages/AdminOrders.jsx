import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import { formatCurrency, formatDateTime, ORDER_STATUS_COLORS } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, search, page],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders', { params: { status: statusFilter, search, page, limit: 20 } });
      return data;
    },
    refetchInterval: 15000
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => api.put(`/admin/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries(['admin-orders']);
    },
    onError: () => toast.error('Failed to update status')
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <>
      <Helmet><title>Orders — Admin | Silverkaari</title></Helmet>
      <div className="flex h-screen bg-dark-900">
        <aside className="w-60 bg-dark-950 border-r border-white/[0.04] flex flex-col p-4">
          <div className="mb-6"><p className="text-white font-semibold text-sm">Silverkaari Admin</p></div>
          {[
            { to: '/admin', label: '📊 Dashboard' },
            { to: '/admin/products', label: '🛍️ Products' },
            { to: '/admin/orders', label: '📦 Orders', active: true },
            { to: '/admin/users', label: '👥 Users' }
          ].map(item => (
            <a key={item.to} href={item.to}
              className={clsx('flex items-center px-3 py-2.5 rounded-xl text-sm mb-1 transition-colors',
                item.active ? 'bg-gold-600/20 text-gold-400' : 'text-silver-500 hover:text-white hover:bg-white/5')}>
              {item.label}
            </a>
          ))}
        </aside>

        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="font-serif text-3xl text-white mb-8">Orders</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or customer..." className="input text-sm max-w-[220px]" />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStatusFilter('')}
                className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  !statusFilter ? 'bg-gold-600/20 text-gold-400' : 'border border-white/10 text-silver-500 hover:text-white')}>
                All
              </button>
              {ORDER_STATUSES.map(s => (
                <button key={s.id} onClick={() => setStatusFilter(s.id)}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                    statusFilter === s.id ? 'bg-gold-600/20 text-gold-400' : 'border border-white/10 text-silver-500 hover:text-white')}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            {isLoading ? (
              <div className="py-20 text-center text-silver-600">Loading...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Update Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-silver-600 text-xs uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/orders/${order._id}`} className="text-gold-400 hover:text-gold-300 font-mono text-sm">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">{order.user?.name}</p>
                        <p className="text-silver-600 text-xs">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-silver-400 text-sm">{order.items.length}</td>
                      <td className="px-4 py-3 text-gold-400 font-semibold text-sm">{formatCurrency(order.finalAmount)}</td>
                      <td className="px-4 py-3 text-silver-400 text-xs capitalize">{order.payment.method} · {order.payment.status}</td>
                      <td className="px-4 py-3">
                        <span className={clsx('badge text-xs', ORDER_STATUS_COLORS[order.status] || 'badge-silver')}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => {
                            setUpdatingId(order._id);
                            updateStatusMutation.mutate({ orderId: order._id, status: e.target.value }, {
                              onSettled: () => setUpdatingId(null)
                            });
                          }}
                          className="input text-xs py-1.5 px-2 min-w-[130px]"
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-silver-600 text-xs">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-12 text-silver-600">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {pagination?.pages > 1 && (
            <div className="flex gap-2 mt-4 justify-center">
              {Array.from({ length: Math.min(pagination.pages, 10) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={clsx('w-9 h-9 rounded-lg text-sm', p === page ? 'bg-gold-600 text-white' : 'border border-white/10 text-silver-400 hover:border-gold-600/50')}>
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

export default AdminOrders;
