import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CheckCircle2, X, Info } from 'lucide-react';
import { Product, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    customerName: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleAddToCartAndRedirect = () => {
    addToCart(product);
    navigate('/cart');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!checkoutData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!checkoutData.address.trim()) newErrors.address = 'Address is required';
    if (!checkoutData.phone.trim()) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const confirmOrder = () => {
    if (!validate()) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: user?.email || 'guest',
      customerName: checkoutData.customerName,
      address: checkoutData.address,
      phone: checkoutData.phone,
      items: [{ ...product, quantity: 1 }],
      total: product.price,
      date: new Date().toISOString(),
      status: 'Processing'
    };

    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...savedOrders, newOrder]));
    
    setIsConfirming(false);
    setIsSuccess(true);
    setCheckoutData({ customerName: '', address: '', phone: '' });
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-72 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="p-3 bg-white text-stone-900 rounded-full hover:bg-amber-700 hover:text-white transition-colors shadow-lg"
          >
            <ShoppingCart size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="p-3 bg-white text-stone-900 rounded-full hover:bg-amber-700 hover:text-white transition-colors shadow-lg"
          >
            <Info size={20} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-full text-stone-900 border border-stone-100">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-serif font-bold text-stone-900 mb-1 cursor-pointer hover:text-amber-700 transition-colors" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
        <p className="text-sm text-stone-700 line-clamp-2 mb-4 h-10 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-xl font-bold text-amber-800">Rs. {product.price.toLocaleString()}</span>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="text-[10px] font-bold text-stone-400 hover:text-stone-900 uppercase tracking-widest transition-colors"
            >
              DETAILS
            </button>
            <button 
              onClick={handleAddToCartAndRedirect}
              className="flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-amber-700 transition-colors group/btn"
            >
              ADD TO CART
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Direct Order Confirmation Modal */}
      <AnimatePresence>
        {isConfirming && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirming(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-stone-900">Checkout</h3>
                <button onClick={() => setIsConfirming(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">{product.name}</p>
                  <p className="text-amber-800 font-bold">Rs. {product.price.toLocaleString()}</p>
                </div>
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
              
              <button 
                onClick={confirmOrder}
                className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20"
              >
                ORDER NOW
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccess(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-serif font-bold text-stone-900">Thank You!</h3>
                <p className="text-stone-500">Your order for <strong>{product.name}</strong> has been successfully placed. Thank you for shopping with us! Our admin team will handle the rest and contact you soon.</p>
              </div>
              <button 
                onClick={() => setIsSuccess(false)}
                className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all"
              >
                CONTINUE SHOPPING
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
