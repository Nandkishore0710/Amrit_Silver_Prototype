import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createOrder, createPaymentIntent } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { useCart } from '../hooks/useCart';
import { INDIA_STATES, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { FiLock } from 'react-icons/fi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CARD_STYLE = {
  style: {
    base: {
      color: '#f0ebe0',
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      '::placeholder': { color: '#605040' },
      iconColor: '#f59e0b'
    },
    invalid: { color: '#f87171' }
  }
};

const CheckoutInner = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, tax, shippingCost, total, clear } = useCart();
  const paymentClientSecret = useSelector(state => state.orders.paymentClientSecret);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=confirm
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onAddressSubmit = (data) => {
    setShippingData(data);
    setStep(2);
  };

  const onPayment = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId !== 'default' ? item.variantId : undefined,
          quantity: item.quantity,
          customization: item.customization
        })),
        shippingAddress: shippingData,
        paymentMethod
      };

      const resultAction = await dispatch(createOrder(orderData));
      if (createOrder.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to create order');
        setLoading(false);
        return;
      }
      const order = resultAction.payload;

      if (paymentMethod === 'stripe') {
        await dispatch(createPaymentIntent(order._id));
        const clientSecret = paymentClientSecret;

        if (!stripe || !elements || !clientSecret) {
          toast.error('Payment setup failed. Please try again.');
          setLoading(false);
          return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: shippingData.name,
              email: shippingData.email || '',
              address: {
                line1: shippingData.street,
                city: shippingData.city,
                state: shippingData.state,
                postal_code: shippingData.pincode,
                country: 'IN'
              }
            }
          }
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }
      }

      clear();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet><title>Checkout — Silverkaari</title></Helmet>

      <div className="page-container py-10">
        <h1 className="font-serif text-4xl text-white mb-8">Checkout</h1>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-10">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={clsx('flex items-center gap-2', i + 1 <= step ? 'text-gold-400' : 'text-silver-700')}>
                <div className={clsx('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                  i + 1 < step ? 'bg-gold-600 text-white' :
                  i + 1 === step ? 'border-2 border-gold-500 text-gold-400' :
                  'border border-white/20 text-silver-700')}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium">{s}</span>
              </div>
              {i < 2 && <div className={clsx('flex-1 h-px', i + 1 < step ? 'bg-gold-600/50' : 'bg-white/10')} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleSubmit(onAddressSubmit)} className="card p-6 space-y-5">
                <h2 className="font-serif text-2xl text-white">Shipping Address</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input {...register('name', { required: 'Name is required' })} className="input" placeholder="Full Name" />
                    {errors.name && <p className="input-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">Phone *</label>
                    <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[6-9][0-9]{9}$/, message: 'Invalid phone' } })} className="input" placeholder="10-digit mobile" />
                    {errors.phone && <p className="input-error">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="input-label">Street Address *</label>
                  <input {...register('street', { required: 'Street is required' })} className="input" placeholder="Flat/House No., Street, Area" />
                  {errors.street && <p className="input-error">{errors.street.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">City *</label>
                    <input {...register('city', { required: 'City is required' })} className="input" placeholder="City" />
                    {errors.city && <p className="input-error">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">State *</label>
                    <select {...register('state', { required: 'State is required' })} className="input">
                      <option value="">Select State</option>
                      {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="input-error">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="input-label">Pincode *</label>
                    <input {...register('pincode', { required: 'Required', pattern: { value: /^[1-9][0-9]{5}$/, message: 'Invalid pincode' } })} className="input" placeholder="6-digit" maxLength={6} />
                    {errors.pincode && <p className="input-error">{errors.pincode.message}</p>}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
                  Continue to Payment
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="card p-6 space-y-6">
                <h2 className="font-serif text-2xl text-white">Payment Method</h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id}
                      className={clsx('flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                        paymentMethod === method.id
                          ? 'border-gold-500 bg-gold-600/10'
                          : 'border-white/10 hover:border-white/20')}>
                      <input type="radio" value={method.id} checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)} className="text-gold-500" />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="text-white font-medium text-sm">{method.label}</p>
                        <p className="text-silver-600 text-xs">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="p-4 bg-dark-700/50 rounded-xl border border-white/10">
                    <label className="input-label mb-3 block">Card Details</label>
                    <CardElement options={CARD_STYLE} className="py-3 px-1" />
                    <p className="text-silver-700 text-xs mt-3 flex items-center gap-1">
                      <FiLock size={11} /> Secured by Stripe. Test card: 4242 4242 4242 4242
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
                  <button onClick={onPayment} disabled={loading}
                    className="btn-primary flex-1 justify-center py-3">
                    {loading ? 'Processing...' : `Pay ${formatCurrency(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-serif text-xl text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                {items.map(item => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-dark-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <p className="text-silver-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gold-400 text-xs font-semibold shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-silver-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between text-silver-500"><span>Tax (GST 18%)</span><span>{formatCurrency(tax)}</span></div>
                <div className="flex justify-between text-silver-500"><span>Shipping</span><span className={shippingCost === 0 ? 'text-green-400' : ''}>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span></div>
                <div className="flex justify-between text-white font-bold border-t border-white/10 pt-2">
                  <span>Total</span><span className="text-gold-400 text-base">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutInner />
  </Elements>
);

export default CheckoutPage;
