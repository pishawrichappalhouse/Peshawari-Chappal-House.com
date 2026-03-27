import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShoppingBag, Package, Calendar, CheckCircle2, XCircle, Clock, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = () => {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders && user) {
        const allOrders: Order[] = JSON.parse(savedOrders);
        const userOrders = allOrders.filter(order => order.userEmail === user.email);
        const sortedOrders = userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(sortedOrders);
        
        // Update selected order if it exists to show real-time status in modal
        if (selectedOrder) {
          const updatedSelected = sortedOrders.find(o => o.id === selectedOrder.id);
          if (updatedSelected && updatedSelected.status !== selectedOrder.status) {
            setSelectedOrder(updatedSelected);
          }
        }
      }
    };

    fetchOrders();

    // Listen for storage changes (for cross-tab updates)
    window.addEventListener('storage', fetchOrders);
    
    // Periodic polling for real-time updates in the same tab
    const interval = setInterval(fetchOrders, 3000);

    return () => {
      window.removeEventListener('storage', fetchOrders);
      clearInterval(interval);
    };
  }, [user, selectedOrder]);

  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const handleCancelOrder = (orderId: string) => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const allOrders: Order[] = JSON.parse(savedOrders);
      const updatedOrders = allOrders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' as const } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
      setOrderToCancel(null);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-100 shadow-xl flex flex-col md:flex-row items-center gap-8"
      >
        <div className="w-32 h-32 bg-stone-100 rounded-full flex items-center justify-center text-stone-300">
          <User size={64} />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">My Profile</h1>
          <p className="text-stone-500 font-medium">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Role</p>
              <p className="text-sm font-bold text-stone-900 uppercase">{user.role || 'User'}</p>
            </div>
            <div className="px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Orders</p>
              <p className="text-sm font-bold text-stone-900">{orders.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-amber-700" size={28} />
          <h2 className="text-3xl font-serif font-bold text-stone-900">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-stone-100 shadow-sm space-y-4">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200">
              <Package size={32} />
            </div>
            <p className="text-stone-500 font-medium">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 flex-shrink-0">
                      <Package size={32} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-xs text-stone-400">#{order.id.slice(-6)}</p>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                          order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      <p className="font-bold text-stone-900">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Calendar size={14} />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col justify-between items-end gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-xl font-bold text-amber-800">Rs. {order.total.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
                      VIEW DETAILS
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-stone-900">Order Details</h3>
                    <p className="font-mono text-xs text-stone-400">#{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={24} className="text-stone-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Shipping Address</label>
                      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                        <p className="text-stone-900 font-bold mb-1">{selectedOrder.customerName}</p>
                        <p className="text-stone-600 text-sm leading-relaxed">{selectedOrder.address}</p>
                        <p className="text-stone-600 text-sm mt-2">{selectedOrder.phone}</p>
                        <div className="mt-4 pt-4 border-t border-stone-200">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Chappal Size</p>
                          <p className="text-stone-900 font-bold">{selectedOrder.size || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-5 bg-stone-50 rounded-2xl border border-stone-100">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</p>
                        <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${
                          selectedOrder.status === 'Confirmed' ? 'text-emerald-600' :
                          selectedOrder.status === 'Cancelled' ? 'text-red-600' :
                          'text-amber-600'
                        }`}>
                          {selectedOrder.status || 'Processing'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Paid</p>
                        <p className="text-xl font-bold text-amber-800">Rs. {selectedOrder.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Items Ordered</label>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-bold text-stone-900 text-sm truncate">{item.name}</p>
                            <p className="text-xs text-stone-500">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedOrder.status === 'Processing' && (
                    <button 
                      onClick={() => setOrderToCancel(selectedOrder.id)}
                      className="flex-grow py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all"
                    >
                      CANCEL ORDER
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex-grow py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancellation Confirmation Modal */}
      <AnimatePresence>
        {orderToCancel && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderToCancel(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
                <XCircle size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-stone-900">Cancel Order?</h3>
                <p className="text-stone-500">Are you sure you want to cancel this order? This action cannot be undone.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderToCancel(null)}
                  className="flex-1 py-4 bg-stone-100 text-stone-600 font-bold rounded-2xl hover:bg-stone-200 transition-all"
                >
                  NO, KEEP IT
                </button>
                <button
                  onClick={() => handleCancelOrder(orderToCancel)}
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  YES, CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
