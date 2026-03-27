import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Users, TrendingUp, Package, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { motion } from 'motion/react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const AdminDashboard = () => {
  const { products } = useProducts();
  const { user: currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      setOrders(orderList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(userList);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeUsers();
    };
  }, [currentUser]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.slice(0, 5);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `Rs. ${totalRevenue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'bg-emerald-500',
      trend: '+12.5%',
      isPositive: true
    },
    { 
      label: 'Total Orders', 
      value: orders.length, 
      icon: ShoppingBag, 
      color: 'bg-amber-500',
      trend: '+8.2%',
      isPositive: true
    },
    { 
      label: 'Total Products', 
      value: products.length, 
      icon: Package, 
      color: 'bg-blue-500',
      trend: '+2 new',
      isPositive: true
    },
    { 
      label: 'Active Users', 
      value: users.length, 
      icon: Users, 
      color: 'bg-purple-500',
      trend: '+15%',
      isPositive: true
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Overview</h1>
          <p className="text-stone-500 font-medium">Welcome back, {currentUser?.username}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-600">
            Last 30 Days
          </div>
          <button className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trend}
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-stone-50 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-stone-900">Recent Orders</h2>
            <button className="text-amber-700 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50">
                  <th className="px-8 py-4 font-bold text-stone-400 text-[10px] uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-4 font-bold text-stone-400 text-[10px] uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 font-bold text-stone-400 text-[10px] uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 font-bold text-stone-400 text-[10px] uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/30 transition-colors">
                    <td className="px-8 py-4 font-mono text-xs text-stone-400">#{order.id.slice(-6)}</td>
                    <td className="px-8 py-4">
                      <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
                      <p className="text-[10px] text-stone-500">{order.userEmail}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right font-bold text-stone-900 text-sm">
                      Rs. {order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-stone-50">
            <h2 className="text-xl font-serif font-bold text-stone-900">Top Products</h2>
          </div>
          <div className="p-6 space-y-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-stone-900 text-sm truncate">{product.name}</p>
                  <p className="text-[10px] text-stone-500 uppercase font-bold tracking-widest">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900 text-sm">Rs. {product.price.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Best Seller</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
