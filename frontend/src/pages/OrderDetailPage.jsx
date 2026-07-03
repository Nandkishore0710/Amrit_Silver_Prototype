import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';
import { formatCurrency, formatDateTime, ORDER_STATUS_COLORS } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import clsx from 'clsx';
import { FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';

const ORDER_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector(state => state.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [id, dispatch]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return <div className="page-container py-20 text-center"><p className="text-silver-500">Order not found</p></div>;

  const currentStepIdx = ORDER_STEPS.indexOf(order.status);
  const isCancelled = ['cancelled', 'refunded'].includes(order.status);

  return (
    <>
      <Helmet><title>Order #{order.orderNumber} — Silverkaari</title></Helmet>
      <div className="page-container py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/orders" className="text-silver-600 hover:text-gold-400 text-sm transition-colors mb-2 flex items-center gap-1">
              ← Back to Orders
            </Link>
            <h1 className="font-serif text-3xl text-white">Order #{order.orderNumber}</h1>
            <p className="text-silver-500 text-sm mt-1">{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={clsx('badge px-3 py-1.5 text-sm', ORDER_STATUS_COLORS[order.status] || 'badge-silver')}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
            {['pending', 'confirmed'].includes(order.status) && (
              <button
                onClick={() => dispatch(cancelOrder(order._id))}
                className="btn-danger text-sm"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress tracker */}
            {!isCancelled && (
              <div className="card p-6">
                <h3 className="font-serif text-lg text-white mb-5">Order Progress</h3>
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-dark-600 z-0" />
                  <div
                    className="absolute top-4 left-4 h-0.5 bg-gold-600 z-0 transition-all duration-500"
                    style={{ width: `${currentStepIdx >= 0 ? (currentStepIdx / (ORDER_STEPS.length - 1)) * 100 : 0}%` }}
                  />
                  <div className="relative z-10 flex justify-between">
                    {ORDER_STEPS.map((step, i) => {
                      const done = i <= currentStepIdx;
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center text-xs border-2',
                            done ? 'bg-gold-600 border-gold-600 text-white' : 'bg-dark-700 border-dark-600 text-silver-700'
                          )}>
                            {done && i < currentStepIdx ? <FiCheck size={14} /> : i + 1}
                          </div>
                          <span className={clsx('text-[10px] text-center capitalize leading-tight max-w-[60px]',
                            done ? 'text-gold-400' : 'text-silver-700')}>
                            {step.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="card p-6">
              <h3 className="font-serif text-lg text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-white/[0.04] last:border-0">
                    <img src={item.image} alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl bg-dark-700 shrink-0" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      {item.customization?.engraving && (
                        <p className="text-silver-600 text-xs">Engraving: "{item.customization.engraving}"</p>
                      )}
                      <p className="text-silver-600 text-xs">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-gold-400 font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
                <div className="flex justify-between text-silver-500"><span>Subtotal</span><span>{formatCurrency(order.totalAmount)}</span></div>
                <div className="flex justify-between text-silver-500"><span>Tax (GST)</span><span>{formatCurrency(order.tax)}</span></div>
                <div className="flex justify-between text-silver-500"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}</span></div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatCurrency(order.discountAmount)}</span></div>
                )}
                <div className="flex justify-between text-white font-bold text-base border-t border-white/10 pt-2">
                  <span>Total</span><span className="text-gold-400">{formatCurrency(order.finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Status history */}
            {order.statusHistory?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-serif text-lg text-white mb-4">Status History</h3>
                <div className="space-y-3">
                  {[...order.statusHistory].reverse().map((s, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gold-600 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-white capitalize">{s.status.replace('_', ' ')}</p>
                        {s.note && <p className="text-silver-600 text-xs">{s.note}</p>}
                        <p className="text-silver-700 text-xs">{formatDateTime(s.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Shipping */}
            <div className="card p-5">
              <h3 className="font-serif text-lg text-white mb-3 flex items-center gap-2">
                <FiTruck className="text-gold-400" /> Shipping Address
              </h3>
              <div className="text-silver-400 text-sm space-y-0.5">
                <p className="text-white font-medium">{order.shipping.address.name}</p>
                <p>{order.shipping.address.street}</p>
                <p>{order.shipping.address.city}, {order.shipping.address.state} — {order.shipping.address.pincode}</p>
                <p>{order.shipping.address.country}</p>
              </div>
              {order.shipping.trackingNumber && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-silver-600 text-xs">Tracking Number</p>
                  <p className="text-gold-400 text-sm font-mono">{order.shipping.trackingNumber}</p>
                  {order.shipping.carrier && <p className="text-silver-600 text-xs">{order.shipping.carrier}</p>}
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="card p-5">
              <h3 className="font-serif text-lg text-white mb-3">Payment</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between text-silver-400">
                  <span>Method</span><span className="text-white capitalize">{order.payment.method}</span>
                </div>
                <div className="flex justify-between text-silver-400">
                  <span>Status</span>
                  <span className={order.payment.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
                    {order.payment.status}
                  </span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between text-silver-400">
                    <span>Transaction ID</span>
                    <span className="text-white font-mono text-xs">{order.payment.transactionId.slice(-12)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;
