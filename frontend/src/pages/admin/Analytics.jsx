import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Activity,
  ArrowUp,
  ArrowDown,
  PieChart as PieIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/admin/analytics');
        setData(response.data);
      } catch (error) {
        toast.error('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>;
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];

  return (
    <div className="space-y-12 pb-12">
      <div className="flex justify-between items-center bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tighter mb-4">Restaurant <span className="text-emerald-500">Insights.</span></h1>
          <p className="text-slate-500 text-xl font-light">See how your business is growing over time.</p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1">Avg. Order Value</p>
           <p className="text-4xl font-bold text-slate-900">₹{data?.average_order_value}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-bold text-slate-900">Sales by Category</h3>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Report</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenue_by_category}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-10 rounded-3xl shadow-sm">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-bold text-slate-900">Order Summary</h3>
             <PieIcon className="text-slate-200 w-6 h-6" />
          </div>
          <div className="h-80 w-full flex">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.orders_by_status}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data?.orders_by_status?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] overflow-hidden relative shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
           <div className="max-w-xl">
             <h3 className="text-3xl font-bold mb-6">Performance Note</h3>
             <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
               Your restaurant is performing well. Most of your revenue is coming from **{data?.revenue_by_category?.[0]?._id || 'Main Course'}**. 
               Keep an eye on the latest trends to grow even faster.
             </p>
             <div className="flex gap-4">
                <button className="px-8 py-4 bg-emerald-500 text-slate-900 font-bold rounded-2xl">Download Data</button>
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all">Refresh</button>
             </div>
           </div>
           
           <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                 <Activity className="text-emerald-400 mb-4" />
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Growth Rate</p>
                 <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">12.4%</span>
                    <span className="text-emerald-400 text-xs font-bold flex items-center mb-1"><ArrowUp size={12} /> 2.1%</span>
                 </div>
              </div>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                 <ShoppingBag className="text-blue-400 mb-4" />
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Repeat Customers</p>
                 <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">64.1%</span>
                    <span className="text-rose-400 text-xs font-bold flex items-center mb-1"><ArrowDown size={12} /> 0.8%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
