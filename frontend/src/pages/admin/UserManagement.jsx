import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { 
  Search, 
  Filter, 
  Trash2, 
  Ban, 
  CheckCircle, 
  UserPlus, 
  X,
  Mail,
  MapPin,
  Calendar,
  Phone,
  Users,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState({ name: '', email: '', password: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null, action: null });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/admin/users?search=${searchTerm}`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Could not get users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAction = async (userId, action) => {
    if (action === 'delete' && !confirmModal.isOpen) {
      setConfirmModal({ isOpen: true, userId, action });
      return;
    }

    const targetUserId = userId || confirmModal.userId;
    const targetAction = action || confirmModal.action;

    try {
      if (targetAction === 'delete') {
        await axios.delete(`/admin/users/${targetUserId}`);
        toast.success('User removed');
      } else if (action === 'disable') {
        await axios.put(`/admin/users/${userId}/disable`);
        toast.success('Account suspended');
      } else if (action === 'enable') {
        await axios.put(`/admin/users/${userId}/enable`);
        toast.success('Account activated');
      }
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/create-admin', adminData);
      toast.success('New admin added successfully');
      setShowAdminForm(false);
      setAdminData({ name: '', email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add admin');
    }
  };

  const openUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/admin/users/${userId}`);
      setSelectedUser(response.data);
    } catch (error) {
      toast.error('Could not load profile');
    }
  };

  const activeCount = Array.isArray(users) ? users.filter(u => !u.is_disabled).length : 0;
  const suspendedCount = Array.isArray(users) ? users.filter(u => u.is_disabled).length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/15 border border-violet-500/20 rounded-full">
                <Users size={14} className="text-violet-400" />
                <span className="text-violet-400 text-xs font-semibold tracking-wide">Customer Management</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Customers<span className="text-violet-400">.</span></h1>
            <p className="text-slate-400 mt-2 font-light">Manage customer accounts, permissions, and activity.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{activeCount}</p>
                <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Active</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-white font-bold text-lg">{suspendedCount}</p>
                <p className="text-rose-400 text-[10px] font-semibold uppercase tracking-wider">Suspended</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAdminForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-sm"
            >
              <UserPlus size={16} /> Add Admin
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-slate-300 focus:outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex items-center justify-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </div>
                </td></tr>
              ) : (users && Array.isArray(users) && users.length > 0) ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => openUserDetails(user.id)}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-sm font-bold text-slate-500 group-hover:from-violet-100 group-hover:to-violet-200 group-hover:text-violet-600 transition-all">
                          {user.name ? user.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm group-hover:text-violet-600 transition-colors">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.is_disabled 
                          ? 'bg-rose-500/10 text-rose-600' 
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_disabled ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        {user.is_disabled ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-sm">{user.location || '—'}</td>
                    <td className="px-6 py-5 text-slate-400 text-sm">{new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleAction(user.id, user.is_disabled ? 'enable' : 'disable')}
                          className={`p-2 rounded-lg transition-all text-sm ${user.is_disabled ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                          title={user.is_disabled ? 'Activate' : 'Suspend'}
                        >
                          {user.is_disabled ? <CheckCircle size={16} /> : <Ban size={16} />}
                        </button>
                        <button 
                          onClick={() => handleAction(user.id, 'delete')}
                          className="p-2 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-16 text-center">
                  <Users size={32} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-medium text-sm">No users found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative shrink-0">
              <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <X size={18} />
              </button>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-violet-500/30">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{selectedUser.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${selectedUser.is_disabled ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <span className="text-slate-300 text-sm">{selectedUser.is_disabled ? 'Suspended' : 'Active'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Mail, label: 'Email', value: selectedUser.email },
                  { icon: Phone, label: 'Phone', value: selectedUser.phone_number || 'N/A' },
                  { icon: MapPin, label: 'Location', value: selectedUser.location || 'N/A' },
                  { icon: Calendar, label: 'Joined', value: new Date(selectedUser.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg"><item.icon size={16} className="text-slate-400" /></div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                      <p className="font-semibold text-slate-900 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4 text-sm">Recent Orders</h3>
                <div className="space-y-2">
                  {selectedUser.recent_orders?.length > 0 ? (
                    selectedUser.recent_orders.map(order => (
                      <div key={order.id} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                        <span className="font-mono text-sm font-semibold text-slate-500">#{order.id.slice(-6)}</span>
                        <span className="font-bold text-slate-900 text-sm">₹{order.total_amount}</span>
                        <span className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">No order history</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleAction(selectedUser.id, selectedUser.is_disabled ? 'enable' : 'disable')}
                  className={`flex-1 py-3.5 font-semibold rounded-xl transition-all text-sm ${
                    selectedUser.is_disabled 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20'
                  }`}
                >
                  {selectedUser.is_disabled ? 'Restore Account' : 'Suspend Account'}
                </button>
                <button 
                  onClick={() => handleAction(selectedUser.id, 'delete')}
                  className="px-6 py-3.5 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 font-semibold rounded-xl transition-all text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Add Admin</h2>
                <p className="text-slate-400 text-sm mt-1">Create a new admin account</p>
              </div>
              <button onClick={() => setShowAdminForm(false)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium" placeholder="e.g. Rahul Patil" value={adminData.name} onChange={(e) => setAdminData({...adminData, name: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium" placeholder="email@example.com" value={adminData.email} onChange={(e) => setAdminData({...adminData, email: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-slate-300 focus:bg-white transition-all text-sm font-medium" placeholder="At least 6 characters" value={adminData.password} onChange={(e) => setAdminData({...adminData, password: e.target.value})} required />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-sm mt-2">
                Create Admin Account
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, userId: null, action: null })}
        onConfirm={handleAction}
        title="Delete User"
        message="Are you sure you want to delete this user? All their data will be permanently removed."
        confirmText="Delete User"
      />
    </div>
  );
};

export default UserManagement;
