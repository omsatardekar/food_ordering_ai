import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Users, ShoppingBasket, BarChart3, Database, FileText, Globe, Cpu } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      {/* Admin Hero */}
      <div className="p-10 bg-slate-100 rounded-3xl border border-slate-200">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Admin Dashboard</h1>
        <p className="text-slate-500 text-xl font-normal">Welcome, {user?.name}. Manage your users, orders, and products here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Users, label: 'Total Users', value: '1', color: 'emerald' },
          { icon: ShoppingBasket, label: 'Total Products', value: '0', color: 'slate' },
          { icon: BarChart3, label: 'Total Sales', value: '$0.00', color: 'slate' },
          { icon: Database, label: 'Server Status', value: 'Online', color: 'emerald' }
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
            <div className="p-3 bg-slate-50 rounded-xl w-fit mb-6">
              <stat.icon className={`w-6 h-6 ${stat.color === 'emerald' ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
            <span className="text-slate-500 uppercase text-[10px] font-bold tracking-widest block mb-1">{stat.label}</span>
            <span className="text-4xl font-bold text-slate-900">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Recent Logins</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <p className="font-bold text-slate-900">{user?.email}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Admin Access</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">Just Now</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Settings className="w-6 h-6 text-emerald-400" /> System Settings
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Orders Module', status: 'Active', color: 'emerald' },
              { label: 'Payments Module', status: 'Active', color: 'emerald' },
              { label: 'User Reports', status: 'Active', color: 'emerald' }
            ].map((item, id) => (
              <div key={id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                <span className="font-medium text-white/70">{item.label}</span>
                <span className={`text-[10px] font-bold text-emerald-400 uppercase tracking-widest`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
