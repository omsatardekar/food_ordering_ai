import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { 
  Users, 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  Utensils,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Customers', value: stats?.total_users || 0, icon: <Users size={22} />, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20', text: 'text-blue-600' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: <ShoppingBag size={22} />, gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10', glow: 'shadow-violet-500/20', text: 'text-violet-600' },
    { label: 'Active Orders', value: stats?.active_orders || 0, icon: <Clock size={22} />, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20', text: 'text-amber-600' },
    { label: "Today's Revenue", value: `₹${stats?.today_revenue || 0}`, icon: <DollarSign size={22} />, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20', text: 'text-emerald-600' },
    { label: 'Total Revenue', value: `₹${stats?.total_revenue || 0}`, icon: <TrendingUp size={22} />, gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/20', text: 'text-rose-600' },
    { label: 'Menu Items', value: stats?.available_menu || 0, icon: <Utensils size={22} />, gradient: 'from-cyan-500 to-sky-500', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20', text: 'text-cyan-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 lg:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full">
                <Sparkles size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-semibold tracking-wide">Live Dashboard</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Welcome Back<span className="text-emerald-400">.</span>
            </h1>
            <p className="text-slate-400 text-base lg:text-lg font-light max-w-lg">
              Here's what's happening in your restaurant today. Stay on top of orders, revenue, and more.
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/admin/analytics" 
              className="group flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:-translate-y-0.5"
            >
              Full Report <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className="group relative bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
          >
            {/* Subtle gradient hover overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{card.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-lg ${card.glow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {card.icon}
              </div>
            </div>

            {/* Bottom accent bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </div>
        ))}
      </div>

      {/* Two Column Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex justify-between items-center p-8 pb-5">
            <h3 className="text-xl font-bold text-slate-900">Recent Orders</h3>
            <Link to="/admin/orders" className="group flex items-center gap-1 text-emerald-600 font-semibold text-sm hover:text-emerald-500 transition-colors">
              View All <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="px-8 pb-8 space-y-3">
            {stats?.recent_orders?.length > 0 ? (
              stats.recent_orders.map((order, idx) => (
                <div 
                  key={order.id} 
                  className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{order.customer_name}</p>
                      <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-900">₹{order.total_amount}</p>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                        order.status === 'Preparing' ? 'bg-amber-50 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <ShoppingBag size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-slate-400 font-medium text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Dishes */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex justify-between items-center p-8 pb-5">
            <h3 className="text-xl font-bold text-slate-900">Popular Dishes</h3>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">Best Sellers</span>
          </div>
          <div className="px-8 pb-8 space-y-2">
            {stats?.top_selling?.length > 0 ? (
              stats.top_selling.map((item, i) => {
                const maxCount = stats.top_selling[0]?.count || 1;
                const percentage = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={i} className="group p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                          i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                          i === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                          i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          #{i + 1}
                        </div>
                        <p className="font-semibold text-slate-800">{item._id}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.count} <span className="text-slate-400 font-normal text-xs">sold</span></span>
                    </div>
                    {/* Progress bar */}
                    <div className="ml-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          i === 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                          'bg-gradient-to-r from-slate-300 to-slate-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center">
                <Utensils size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-slate-400 font-medium text-sm">No sales data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
