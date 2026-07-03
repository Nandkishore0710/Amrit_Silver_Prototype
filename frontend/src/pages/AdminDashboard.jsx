import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ORDER_STATUS_COLORS } from '../utils/helpers';
import api from '../api';
import { io } from 'socket.io-client';
import { FiPackage, FiUsers, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiLogOut, FiShoppingBag, FiSettings } from 'react-icons/fi';
import clsx from 'clsx';

const GOLD = '#f59e0b';
const COLORS = ['#f59e0b', '#b45309', '#d97706', '#78350f', '#fbbf24', '#92400e'];

const StatCard = ({ icon: Icon, label, value, sub, color = 'gold', trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="stat-card"
  >
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center`}
        style={{ background: `${color}20` }}>
        <Icon size={22} style={{ color }} />
      </div>
      {trend !== undefined && (
        <span className={clsx('badge text-xs', trend >= 0 ? 'badge-success' : 'badge-danger')}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-silver-500 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-white text-2xl font-bold font-serif mt-0.5">{value}</p>
      {sub && <p className="text-silver-600 text-xs mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm">
      <p className="text-silver-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveOrders, setLiveOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => { const { data } = await api.get('/admin/stats'); return data.data; },
    refetchInterval: 30000
  });

  const { data: revenueData } = useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: async () => { const { data } = await api.get('/admin/stats/revenue', { params: { period: 'month' } }); return data.data; }
  });

  const { data: orderStatusData } = useQuery({
    queryKey: ['admin', 'orderStatus'],
    queryFn: async () => { const { data } = await api.get('/admin/stats/orders'); return data.data; }
  });

  const { data: topProducts } = useQuery({
    queryKey: ['admin', 'topProducts'],
    queryFn: async () => { const { data } = await api.get('/admin/stats/top-products'); return data.data; }
  });

  const { data: categoryData } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => { const { data } = await api.get('/admin/stats/categories'); return data.data; }
  });

  const { data: alerts } = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: async () => { const { data } = await api.get('/admin/inventory/alerts'); return data.data; }
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['admin', 'orders', 'recent'],
    queryFn: async () => { const { data } = await api.get('/admin/orders', { params: { limit: 10, sort: 'newest' } }); return data.data; },
    refetchInterval: 15000
  });

  // Socket.io real-time
  useEffect(() => {
    const token = localStorage.getItem('sk_token');
    const s = io('/', {
      auth: { token },
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });
    s.on('connect', () => {
      s.emit('join-admin');
    });
    s.on('new-order', (order) => {
      setLiveOrders(prev => [order, ...prev.slice(0, 4)]);
      refetchStats();
    });
    s.on('order-update', (order) => {
      refetchStats();
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: FiTrendingUp, active: true },
    { to: '/admin/products', label: 'Products', icon: FiShoppingBag },
    { to: '/admin/orders', label: 'Orders', icon: FiPackage },
    { to: '/admin/users', label: 'Users', icon: FiUsers }
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — Silverkaari</title></Helmet>

      <div className="flex h-screen bg-dark-900 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-dark-950 border-r border-white/[0.04] flex flex-col">
          {/* Brand */}
          <div className="p-5 border-b border-white/[0.04]">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-600 flex items-center justify-center text-white text-sm font-bold">S</div>
              <div>
                <p className="text-white text-sm font-semibold">Silverkaari</p>
                <p className="text-silver-700 text-xs">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(item => (
              <Link key={item.to} to={item.to}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  item.active ? 'bg-gold-600/20 text-gold-400' : 'text-silver-500 hover:text-white hover:bg-white/5'
                )}>
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/[0.04]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold-700 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0]}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                <p className="text-silver-700 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full flex items-center gap-2 text-silver-600 hover:text-red-400 text-xs transition-colors">
              <FiLogOut size={14} />Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl text-white">Dashboard</h1>
                <p className="text-silver-600 text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}! Here's what's happening.</p>
              </div>
              {liveOrders.length > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center gap-2 bg-green-900/30 border border-green-700/30 text-green-400 px-3 py-2 rounded-xl text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {liveOrders.length} new order{liveOrders.length !== 1 ? 's' : ''}
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FiDollarSign} label="Total Revenue" value={stats ? formatCurrency(stats.revenue?.total || 0) : '—'}
                sub={`Today: ${formatCurrency(stats?.revenue?.today || 0)}`} trend={stats?.revenue?.growth} color={GOLD} />
              <StatCard icon={FiPackage} label="Total Orders" value={stats?.orders?.total || 0}
                sub={`Pending: ${stats?.orders?.pending || 0}`} trend={stats?.orders?.growth} color="#60a5fa" />
              <StatCard icon={FiUsers} label="Customers" value={stats?.users?.total || 0}
                sub={`New today: ${stats?.users?.today || 0}`} trend={stats?.users?.growth} color="#a78bfa" />
              <StatCard icon={FiShoppingBag} label="Products" value={stats?.products?.total || 0}
                sub={`Out of stock: ${stats?.products?.outOfStock || 0}`} color="#34d399" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue chart */}
              <div className="lg:col-span-2 card p-6">
                <h3 className="font-serif text-lg text-white mb-6">Revenue (30 Days)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueData || []}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke={GOLD} strokeWidth={2}
                      fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: GOLD }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status Pie */}
              <div className="card p-6">
                <h3 className="font-serif text-lg text-white mb-6">Order Status</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={orderStatusData || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                      dataKey="count" nameKey="status" paddingAngle={3}>
                      {(orderStatusData || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name.replace('_', ' ')]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {(orderStatusData || []).slice(0, 4).map((item, i) => (
                    <div key={item.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-silver-400 capitalize">{item.status?.replace('_', ' ')}</span>
                      </div>
                      <span className="text-white font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="card p-6">
                <h3 className="font-serif text-lg text-white mb-6">Top Products</h3>
                <div className="space-y-3">
                  {(topProducts || []).slice(0, 5).map((p, i) => (
                    <div key={p._id || i} className="flex items-center gap-3">
                      <span className="text-silver-700 text-sm w-5">{i + 1}</span>
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-dark-700 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="h-1 bg-dark-600 rounded-full flex-1">
                            <div className="h-full bg-gold-600 rounded-full" style={{ width: `${p.percentage || 0}%` }} />
                          </div>
                          <span className="text-silver-600 text-xs shrink-0">{p.sold} sold</span>
                        </div>
                      </div>
                      <span className="text-gold-400 text-sm font-semibold shrink-0">{formatCurrency(p.revenue || 0)}</span>
                    </div>
                  ))}
                  {!topProducts && (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="skeleton w-5 h-4 rounded" />
                        <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="skeleton h-3 w-3/4 rounded" />
                          <div className="skeleton h-1.5 w-full rounded" />
                        </div>
                        <div className="skeleton w-16 h-4 rounded" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg text-white">Recent Orders</h3>
                  <Link to="/admin/orders" className="text-gold-600 text-xs hover:text-gold-400">View all →</Link>
                </div>
                <div className="space-y-3">
                  {(recentOrders || []).slice(0, 5).map(order => (
                    <Link key={order._id} to={`/orders/${order._id}`}
                      className="flex items-center justify-between py-2 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
                      <div>
                        <p className="text-white text-sm font-medium">#{order.orderNumber}</p>
                        <p className="text-silver-600 text-xs">{order.user?.name} · {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold-400 text-sm font-semibold">{formatCurrency(order.finalAmount)}</p>
                        <span className={clsx('badge text-[10px]', ORDER_STATUS_COLORS[order.status] || 'badge-silver')}>
                          {order.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Alerts */}
            {alerts?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-serif text-lg text-white mb-4 flex items-center gap-2">
                  <FiAlertTriangle className="text-amber-400" />
                  Inventory Alerts
                  <span className="badge bg-amber-900/30 text-amber-400 border border-amber-700/20">{alerts.length}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {alerts.slice(0, 6).map((product, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-amber-900/10 border border-amber-800/20 rounded-xl">
                      <FiAlertTriangle className="text-amber-400 shrink-0" size={16} />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm truncate">{product.name}</p>
                        <p className="text-amber-400 text-xs">{product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}</p>
                      </div>
                      <Link to={`/admin/products?edit=${product._id}`}
                        className="text-xs text-gold-600 hover:text-gold-400 shrink-0">Update</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category chart */}
            {categoryData?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-serif text-lg text-white mb-6">Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" name="Revenue" fill={GOLD} radius={[0, 4, 4, 0]} maxBarSize={24}>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
