import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    customerName: '',
    address: '',
    phone: '',
    size: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOrderComplete) {
      const timer = setTimeout(() => {
        setIsOrderComplete(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOrderComplete]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!checkoutData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!checkoutData.address.trim()) newErrors.address = 'Address is required';
    if (!checkoutData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!checkoutData.size) newErrors.size = 'Size is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCheckingOut(true);
  };

  const confirmOrder = () => {
    if (!validate()) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: user?.email || 'guest',
      customerName: checkoutData.customerName,
      address: checkoutData.address,
      phone: checkoutData.phone,
      size: checkoutData.size,
      items: [...cart],
      total: total,
      date: new Date().toISOString(),
      status: 'Processing'
    };

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...savedOrders, newOrder]));
    
    setOrderedItems(cart.map(item => item.name));
    setIsOrderComplete(true);
    setIsCheckingOut(false);
    clearCart();
  };

  if (cart.length === 0 && !isOrderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: -10 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
          className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300"
        >
          <ShoppingBag size={40} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Your cart is empty</h2>
          <p className="text-stone-700">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl hover:shadow-stone-900/30 shadow-stone-900/20 group"
          >
            START SHOPPING
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-grow space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">Shopping Cart</h1>
            <p className="text-stone-700">You have {cart.length} items in your cart.</p>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-stone-100 shadow-sm"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif font-bold text-lg text-stone-900">{item.name}</h3>
                  <p className="text-xs text-stone-600 uppercase tracking-widest font-bold">{item.category}</p>
                  <p className="text-sm text-stone-700 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-bold text-stone-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-96">
          <div className="sticky top-32 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-stone-700">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Free</span>
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                <span className="text-stone-900 font-bold">Total</span>
                <span className="text-3xl font-bold text-amber-800">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 flex items-center justify-center gap-2 group"
            >
              CHECKOUT NOW
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest font-bold">
              Secure Checkout • 100% Genuine Leather
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckingOut(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-stone-900">Checkout Details</h2>
                <button onClick={() => setIsCheckingOut(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 bg-stone-50 border ${errors.customerName ? 'border-red-500' : 'border-stone-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all`}
                    value={checkoutData.customerName}
                    onChange={(e) => setCheckoutData({ ...checkoutData, customerName: e.target.value })}
                  />
                  {errors.customerName && <p className="text-red-500 text-[10px] font-bold">{errors.customerName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number"
                    className={`w-full px-4 py-3 bg-stone-50 border ${errors.phone ? 'border-red-500' : 'border-stone-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all`}
                    value={checkoutData.phone}
                    onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] font-bold">{errors.phone}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Chappal Size</label>
                  <select 
                    className={`w-full px-4 py-3 bg-stone-50 border ${errors.size ? 'border-red-500' : 'border-stone-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all`}
                    value={checkoutData.size}
                    onChange={(e) => setCheckoutData({ ...checkoutData, size: e.target.value })}
                  >
                    <option value="">Select Size</option>
                    {[6, 7, 8, 9, 10, 11, 12].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.size && <p className="text-red-500 text-[10px] font-bold">{errors.size}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Delivery Address</label>
                  <textarea 
                    placeholder="Enter your complete address"
                    rows={3}
                    className={`w-full px-4 py-3 bg-stone-50 border ${errors.address ? 'border-red-500' : 'border-stone-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all resize-none`}
                    value={checkoutData.address}
                    onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                  />
                  {errors.address && <p className="text-red-500 text-[10px] font-bold">{errors.address}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">Total Amount</p>
                  <p className="text-2xl font-bold text-amber-800">Rs. {total.toLocaleString()}</p>
                </div>
                <button 
                  onClick={confirmOrder}
                  className="px-8 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20"
                >
                  ORDER NOW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Success Modal */}
      <AnimatePresence>
        {isOrderComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-12 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-stone-900">Thank You!</h3>
                <p className="text-stone-500">
                  Your order for <strong>{orderedItems.join(', ')}</strong> has been successfully placed. 
                  Thank you for shopping with us! Our admin team will process it shortly and contact you if needed.
                </p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all"
              >
                BACK TO HOME
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
