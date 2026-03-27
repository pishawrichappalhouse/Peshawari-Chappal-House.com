import React, { useState, useEffect } from 'react';
import { 
  Trash2, Search, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') return;

    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUsers(userList);
    });

    return () => unsubscribeUsers();
  }, [currentUser]);

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Users</h1>
          <p className="text-stone-500 font-medium">Manage user accounts and permissions.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all font-medium"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Username</th>
                <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Email</th>
                <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 font-bold text-stone-400 text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {users
                .filter(u => 
                  u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                  (u.username && u.username.toLowerCase().includes(userSearchQuery.toLowerCase()))
                )
                .map((user) => (
                <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-stone-900">{user.username || 'N/A'}</td>
                  <td className="px-8 py-6 font-medium text-stone-600">{user.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                      user.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user.email !== currentUser?.email && (
                      <button 
                        onClick={() => setUserToDelete(user.id)}
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUserToDelete(null)}
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
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setUserToDelete(null)}
                    className="flex-grow py-3 bg-stone-100 text-stone-900 font-bold rounded-xl hover:bg-stone-200 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => deleteUser(userToDelete)}
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

export default AdminUsers;
