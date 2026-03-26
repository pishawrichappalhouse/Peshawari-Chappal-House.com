import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, ShoppingBag, Users, TrendingUp, 
  Package, X, Check, Search, Image as ImageIcon, DollarSign,
  AlertTriangle
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user: currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [lastUpdatedOrderId, setLastUpdatedOrderId] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'Classic'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (lastUpdatedOrderId) {
      const timer = setTimeout(() => {
        setLastUpdatedOrderId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedOrderId]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Update selectedOrder if it's the one being modified
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    // Trigger highlight
    setLastUpdatedOrderId(orderId);
  };

  const deleteUser = (email: string) => {
    const updatedUsers = users.filter(user => user.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUserToDelete(null);
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrderToDelete(null);
    if (selectedOrder?.id === orderId) {
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        image: product.image,
        description: product.description,
        category: product.category
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        image: '',
        description: '',
        category: 'Classic'
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleOpenOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=800',
      description: formData.description,
      category: formData.category
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header & Stats */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-stone-700">Manage your products, orders and business performance.</p>
          </div>
          <div className="flex bg-stone-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              Users
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Package size={24} />, label: "Total Products", value: products.length, color: "bg-blue-50 text-blue-600" },
            { icon: <ShoppingBag size={24} />, label: "Total Orders", value: orders.length, color: "bg-amber-50 text-amber-600" },
            { icon: <TrendingUp size={24} />, label: "Total Revenue", value: `Rs. ${totalRevenue.toLocaleString()}`, color: "bg-emerald-50 text-emerald-600" },
            { icon: <Users size={24} />, label: "Active Users", value: users.length, color: "bg-purple-50 text-purple-600" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-bold text-stone-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
        {activeTab === 'products' ? (
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-stone-900">Product Management</h2>
              <button 
                onClick={() => handleOpenModal()}
                className="px-6 py-3 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all flex items-center gap-2 shadow-lg shadow-stone-900/20"
              >
                <Plus size={20} />
                ADD PRODUCT
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Product</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Category</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Price</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {products.map((product) => (
                    <tr key={product.id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{product.name}</p>
                            <p className="text-xs text-stone-700 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-6 font-bold text-stone-900">Rs. {product.price.toLocaleString()}</td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="p-8 space-y-8">
            <h2 className="text-2xl font-serif font-bold text-stone-900">Order History</h2>
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
                    <tr className="border-b border-stone-100">
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Order ID</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Customer</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Items</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Size</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Total</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Status</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Date</th>
                      <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest text-right">Actions</th>
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
                        <td className="py-6 font-mono text-xs text-stone-400">#{order.id.slice(-6)}</td>
                        <td className="py-6 font-bold text-stone-900">{order.userEmail}</td>
                        <td className="py-6">
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
                        <td className="py-6">
                          <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded-full">
                            {order.size || 'N/A'}
                          </span>
                        </td>
                        <td className="py-6 font-bold text-amber-800">Rs. {order.total.toLocaleString()}</td>
                        <td className="py-6">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                            order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                        <td className="py-6 text-sm text-stone-700">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-6 text-right">
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
        ) : (
          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h2 className="text-2xl font-serif font-bold text-stone-900">User Management</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-12 pr-6 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Username</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Email</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Password</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest">Role</th>
                    <th className="pb-4 font-bold text-stone-400 text-xs uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {users
                    .filter(u => 
                      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                      (u.username && u.username.toLowerCase().includes(userSearchQuery.toLowerCase()))
                    )
                    .map((user) => (
                    <tr key={user.email} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-6 font-bold text-stone-900">{user.username || 'N/A'}</td>
                      <td className="py-6 font-medium text-stone-600">{user.email}</td>
                      <td className="py-6 font-mono text-xs text-stone-900">{user.password}</td>
                      <td className="py-6">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        {user.email !== currentUser?.email && (
                          <button 
                            onClick={() => setUserToDelete(user.email)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                  <h3 className="text-2xl font-serif font-bold text-stone-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-12 pr-6 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Price (Rs.)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                      <input 
                        type="number" 
                        required
                        className="w-full pl-12 pr-6 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Category</label>
                    <select 
                      className="w-full px-6 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Classic">Classic</option>
                      <option value="Premium">Premium</option>
                      <option value="Modern">Modern</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Product Image</label>
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex items-center justify-center overflow-hidden group relative">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-stone-300" size={32} />
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-bold">
                          CHANGE
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                      <div className="flex-grow space-y-2">
                        <p className="text-xs text-stone-500">Upload a high-quality image of the product. Supported formats: JPG, PNG, WebP.</p>
                        {!imagePreview && (
                          <label className="inline-block px-4 py-2 bg-stone-100 text-stone-900 text-xs font-bold rounded-xl cursor-pointer hover:bg-stone-200 transition-colors">
                            SELECT IMAGE
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full px-6 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit" 
                      className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      {editingProduct ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
                      <p className="text-[10px] text-stone-400">Ordered on {new Date(selectedOrder.date).toLocaleString()}</p>
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

      {/* Confirmation Modals */}
      <AnimatePresence>
        {(userToDelete || orderToDelete) && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setUserToDelete(null); setOrderToDelete(null); }}
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
                    Are you sure you want to delete this {userToDelete ? 'user' : 'order'}? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setUserToDelete(null); setOrderToDelete(null); }}
                    className="flex-grow py-3 bg-stone-100 text-stone-900 font-bold rounded-xl hover:bg-stone-200 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => {
                      if (userToDelete) deleteUser(userToDelete);
                      if (orderToDelete) deleteOrder(orderToDelete);
                    }}
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

export default AdminDashboard;
