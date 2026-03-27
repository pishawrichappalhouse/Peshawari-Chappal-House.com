import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Wait for AuthContext to update and check isAdmin
      // If the login is successful, the AuthContext will update the user state.
      // We can check if the user is admin after a short delay or by using a useEffect.
      // For now, we'll navigate and the AdminRoute will handle the protection.
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('Admin account not found. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in Firebase Console.');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login();
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-700/20 via-transparent to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-stone-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-700 relative z-10"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-700/20 rounded-2xl flex items-center justify-center text-amber-500 mx-auto border border-amber-700/30">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Admin Portal</h2>
              <p className="text-stone-400 text-sm font-medium uppercase tracking-widest">Management Access Only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 text-red-400 text-sm font-bold rounded-2xl border border-red-500/20 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Admin Email" 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-stone-900/50 border border-stone-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder:text-stone-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-stone-900/50 border border-stone-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium placeholder:text-stone-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-amber-700/20"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-stone-800 px-4 text-stone-500">OR</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white hover:bg-stone-100 disabled:opacity-50 text-stone-900 font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-white/5"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            SIGN IN WITH GOOGLE
          </button>

          <div className="pt-6 border-t border-stone-700 flex justify-center">
            <Link 
              to="/" 
              className="text-stone-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
            >
              <Home size={16} />
              BACK TO PUBLIC SITE
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
