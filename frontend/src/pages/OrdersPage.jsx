import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/slices/orderSlice';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ORDER_STATUS_COLORS } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import clsx from 'clsx';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { list: orders, loading } = useSelector(state => state.orders);

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  return (
    <>
      <Helmet><title>My Orders — Silverkaari</title></Helmet>
      <div className="page-container py-10">
        <h1 className="font-serif text-4xl text-white mb-8">My Orders</h1>

        {loading ? <LoadingSpinner size="lg" className="py-20" /> : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl opacity-10 mb-6">📦</div>
            <h2 className="font-serif text-3xl text-white mb-3">No orders yet</h2>
            <p className="text-silver-500 mb-8">Start shopping and your orders will appear here</p>
            <Link to="/products" className="btn-primary text-base px-8 py-4">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`}
                className="card-hover block p-6 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Product thumbnails */}
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i}
                          src={item.image || item.product?.images?.[0]?.url}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-dark-700 bg-dark-800"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-xl bg-dark-700 border-2 border-dark-800 flex items-center justify-center text-xs text-silver-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">#{order.orderNumber}</p>
                      <p className="text-silver-600 text-sm">{formatDate(order.createdAt)}</p>
                      <p className="text-silver-500 text-xs mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-right">
                      <p className="text-gold-400 font-bold">{formatCurrency(order.finalAmount)}</p>
                      <p className="text-silver-600 text-xs">{order.payment.method?.toUpperCase()}</p>
                    </div>
                    <span className={clsx('badge', ORDER_STATUS_COLORS[order.status] || 'badge-silver')}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
