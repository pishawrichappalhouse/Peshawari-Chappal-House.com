import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Trash2, X, Check, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminOrders = () => {
  const { user: currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [lastUpdatedOrderId, setLastUpdatedOrderId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      setOrders(orderList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    return () => unsubscribeOrders();
  }, [currentUser]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setLastUpdatedOrderId(orderId);
      setTimeout(() => setLastUpdatedOrderId(null), 2000);
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrderToDelete(null);
      if (selectedOrder?.id === orderId) {
        setIsOrderModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  };

  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Orders</h1>
          <p className="text-stone-500 font-medium">Track and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-stone-50 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-900">Order History</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Filter:</span>
            <select className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
              <option>All Orders</option>
              <option>Processing</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
              <ShoppingBag size={32} />
            </div>
            <p className="text-stone-700">No orders placed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Items</th>
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Total</th>
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Date</th>
                  <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-stone-50/50 transition-all duration-500 ${
                      lastUpdatedOrderId === order.id ? 'bg-amber-50/50 ring-1 ring-inset ring-amber-200' : ''
                    }`}
                  >
                    <td className="px-8 py-6 font-mono text-xs text-stone-400">#{order.id.slice(-6)}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-stone-900">{order.customerName}</p>
                      <p className="text-[10px] text-stone-500">{order.userEmail}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-3 overflow-hidden">
                        {order.items.map((item, i) => (
                          <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-stone-100">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-stone-200 flex items-center justify-center text-[10px] font-bold text-stone-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-amber-800">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-700">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenOrderModal(order)}
                          className="px-3 py-1.5 text-[10px] font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all"
                        >
                          DETAILS
                        </button>
                        {order.status === 'Processing' && (
                          <>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Confirm Order"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Cancel Order"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setOrderToDelete(order.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {isOrderModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
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
                    <p className="text-xs font-mono text-stone-400">#{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Customer Information</label>
                      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Name</p>
                          <p className="text-stone-900 font-bold">{selectedOrder.customerName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Email</p>
                          <p className="text-stone-900 font-medium">{selectedOrder.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Phone</p>
                          <p className="text-stone-900 font-bold">{selectedOrder.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Address</p>
                          <p className="text-stone-900 text-sm leading-relaxed">{selectedOrder.address}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Chappal Size</p>
                          <p className="text-stone-900 font-bold">{selectedOrder.size || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Order Status</label>
                      <div>
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest ${
                          selectedOrder.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          selectedOrder.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {selectedOrder.status || 'Processing'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Total Amount</label>
                      <p className="text-2xl font-bold text-amber-800">Rs. {selectedOrder.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Order Items</label>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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

                <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row gap-4">
                  {selectedOrder.status === 'Processing' ? (
                    <>
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'Confirmed')}
                        className="flex-grow py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={20} />
                        CONFIRM ORDER
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                        className="flex-grow py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                      >
                        <X size={20} />
                        CANCEL ORDER
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsOrderModalOpen(false)}
                      className="w-full py-4 bg-stone-100 text-stone-900 font-bold rounded-2xl hover:bg-stone-200 transition-all"
                    >
                      CLOSE
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {orderToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderToDelete(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600">
                  <AlertTriangle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    Confirm Deletion
                  </h3>
                  <p className="text-stone-600 text-sm">
                    Are you sure you want to delete this order? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setOrderToDelete(null)}
                    className="flex-grow py-3 bg-stone-100 text-stone-900 font-bold rounded-xl hover:bg-stone-200 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => deleteOrder(orderToDelete)}
                    className="flex-grow py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
