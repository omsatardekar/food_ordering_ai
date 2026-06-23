import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Clock, TrendingUp, CreditCard, Gift, MapPin } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="p-10 bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white">
        <h1 className="text-5xl font-bold mb-4">Welcome, {user?.name}</h1>
        <p className="text-slate-400 text-xl font-normal">Check your orders and manage your account settings below.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Stats */}
        <div className="lg:col-span-1 bento-card">
          <div className="p-4 bg-emerald-50 rounded-2xl w-fit mb-6">
            <User className="text-emerald-600 w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h3>
          <div className="space-y-4 text-slate-600 font-medium">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" /> {user?.email}
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-400" /> Role: {user?.role}
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" /> Member since: {new Date(user?.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Dynamic Activity */}
        <div className="lg:col-span-2 bento-card">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">My Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <TrendingUp className="text-emerald-600 mb-4 w-6 h-6" />
              <span className="text-slate-400 uppercase text-xs font-bold block mb-2">Total Orders</span>
              <span className="text-5xl font-bold text-slate-900">0</span>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <CreditCard className="text-rose-500 mb-4 w-6 h-6" />
              <span className="text-slate-400 uppercase text-xs font-bold block mb-2">My Balance</span>
              <span className="text-5xl font-bold text-slate-900">$0</span>
            </div>
          </div>
        </div>

        {/* Promo Card */}
        <div className="lg:col-span-1 p-8 bg-emerald-600 text-white rounded-3xl flex flex-col justify-between shadow-lg">
          <div>
            <Gift className="text-white w-10 h-10 mb-6 opacity-30" />
            <h3 className="text-3xl font-bold mb-4">Refer a Friend</h3>
            <p className="text-emerald-100 text-sm mb-6">Invite your friends and get $10 discount on your next order.</p>
          </div>
          <button className="w-full py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-colors">
            Invite Now
          </button>
        </div>
      </div>

      {/* History */}
      <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Order History</h3>
          <button className="text-emerald-600 font-bold text-sm">View All</button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <Clock className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg font-medium text-slate-400">You haven't placed any orders yet.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
