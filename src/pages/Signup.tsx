import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password, username);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-stone-100"
      >
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">Join Us</h2>
            <p className="text-stone-700 font-light">Create an account to start your collection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-700 transition-colors" size={20} />
                <input 
                   type="text" 
                   placeholder="Username" 
                   required
                   className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all font-medium"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-700 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-700 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-700 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-stone-900/20"
            >
              CREATE ACCOUNT
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="pt-6 border-t border-stone-100 flex flex-col items-center gap-4">
            <p className="text-sm text-stone-700">Already have an account?</p>
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white border border-stone-200 text-stone-900 font-bold rounded-full hover:border-stone-900 transition-all flex items-center gap-2"
            >
              <LogIn size={18} />
              SIGN IN
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
