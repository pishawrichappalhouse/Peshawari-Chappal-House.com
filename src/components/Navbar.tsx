import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ShieldCheck, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const { orders } = useOrders();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!user) {
      setLatestOrder(null);
      return;
    }

    const userOrders = orders.filter(o => o.userEmail === user.email);
    if (userOrders.length > 0) {
      const sorted = userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const currentLatest = sorted[0];
      setLatestOrder(currentLatest);

      // Check for status changes to show notification
      const notifiedOrders = JSON.parse(localStorage.getItem(`notified_orders_${user.email}`) || '[]');
      if (currentLatest.status === 'Confirmed' && !notifiedOrders.includes(currentLatest.id)) {
        setShowConfirmPopup(true);
        localStorage.setItem(`notified_orders_${user.email}`, JSON.stringify([...notifiedOrders, currentLatest.id]));
      }
    } else {
      setLatestOrder(null);
    }
  }, [user, orders]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold tracking-tighter text-stone-900">
              PESHAWARI <span className="text-amber-700">CHAPPAL</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-amber-700 transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-medium hover:text-amber-700 transition-colors">Shop</Link>
            <Link to="/about" className="text-sm font-medium hover:text-amber-700 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-amber-700 transition-colors">Contact</Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="text-sm font-medium text-amber-700 flex items-center gap-1">
                <ShieldCheck size={16} /> Admin Portal
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 hover:bg-stone-100 rounded-full transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-700 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {latestOrder && (
                  <Link 
                    to="/profile" 
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-stone-100 transition-all hover:shadow-sm"
                  >
                    <Package size={12} className="text-amber-700" />
                    <span className="text-stone-400">Order:</span>
                    <span className={
                      latestOrder.status === 'Confirmed' ? 'text-emerald-600' :
                      latestOrder.status === 'Cancelled' ? 'text-red-600' :
                      'text-amber-600'
                    }>
                      {latestOrder.status || 'Processing'}
                    </span>
                  </Link>
                )}
                <Link to="/profile" className="flex items-center space-x-2 p-2 hover:bg-stone-100 rounded-full transition-colors group">
                  <div className="relative">
                    <User size={20} className="group-hover:text-amber-700" />
                    {latestOrder && (
                      <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${
                        latestOrder.status === 'Confirmed' ? 'bg-emerald-500' :
                        latestOrder.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-amber-600 animate-pulse'
                      }`} />
                    )}
                  </div>
                  <span className="text-xs font-medium text-stone-500 group-hover:text-stone-900">{user.username || user.email.split('@')[0]}</span>
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <User size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-700 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/about" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="block text-lg font-medium text-amber-700" onClick={() => setIsMenuOpen(false)}>Admin Portal</Link>
              )}
              <div className="pt-4 border-t border-stone-100">
                {user ? (
                  <div className="space-y-4">
                    {latestOrder && (
                      <div className="px-4 py-2 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-amber-700" />
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Latest Order</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          latestOrder.status === 'Confirmed' ? 'text-emerald-600' :
                          latestOrder.status === 'Cancelled' ? 'text-red-600' :
                          'text-amber-600'
                        }`}>
                          {latestOrder.status || 'Processing'}
                        </span>
                      </div>
                    )}
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-stone-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="relative">
                        <User size={20} />
                        {latestOrder && (
                          <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 border border-white rounded-full ${
                            latestOrder.status === 'Confirmed' ? 'bg-emerald-500' :
                            latestOrder.status === 'Cancelled' ? 'bg-red-500' :
                            'bg-amber-600 animate-pulse'
                          }`} />
                        )}
                      </div>
                      <span>My Profile ({user.username || user.email.split('@')[0]})</span>
                    </Link>
                    <button 
                      onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}
                      className="flex items-center space-x-2 text-stone-600"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="flex items-center space-x-2 text-stone-600" onClick={() => setIsMenuOpen(false)}>
                    <User size={20} />
                    <span>Login / Signup</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Confirmation Popup */}
      <AnimatePresence>
        {showConfirmPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setShowConfirmPopup(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-stone-900">Order Confirm</h3>
                <p className="text-stone-500 text-sm">
                  Your order has been confirmed by the admin! Thank you for your patience.
                </p>
              </div>
              <button 
                onClick={() => setShowConfirmPopup(false)}
                className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/20"
              >
                GOT IT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
