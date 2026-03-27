import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Home,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-stone-800">
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tighter">
              PESHAWARI <span className="text-amber-500">PORTAL</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">Admin Management</span>
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' 
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-stone-800 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-amber-500 font-bold border border-stone-700">
              {user?.username?.[0].toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-stone-400 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            Logout
          </button>
          
          <Link
            to="/"
            className="w-full flex items-center gap-3 p-4 text-stone-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-2xl transition-all font-bold text-sm"
          >
            <Home size={20} />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
