import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { 
  Search, 
  ChevronRight, 
  X, 
  User, 
  ShoppingBag, 
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Package,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['All', 'Placed', 'Confirmed', 'Preparing', 'Ready', 'Picked Up'];

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/orders?status=${activeStatus === 'All' ? '' : activeStatus}`);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatus]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order is now ${newStatus}`);
      if (selectedOrder) {
        const response = await axios.get(`/orders/${orderId}`);
        setSelectedOrder(response.data);
      }
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed': return { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' };
      case 'Confirmed': return { bg: 'bg-violet-500/10', text: 'text-violet-600', dot: 'bg-violet-500' };
      case 'Preparing': return { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500' };
      case 'Ready': return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      case 'Picked Up': return { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500' };
      default: return { bg: 'bg-slate-500/10', text: 'text-slate-600', dot: 'bg-slate-500' };
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const statusCounts = Array.isArray(orders) ? {} : {};
  if (Array.isArray(orders)) {
    orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/15 border border-blue-500/20 rounded-full">
                <Package size={14} className="text-blue-400" />
                <span className="text-blue-400 text-xs font-semibold tracking-wide">Order Management</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">All Orders<span className="text-blue-400">.</span></h1>
            <p className="text-slate-400 mt-2 font-light">Track, manage, and update every customer order in real-time.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <ShoppingBag size={18} className="text-blue-400" />
            <div>
              <p className="text-white font-bold text-xl">{Array.isArray(orders) ? orders.length : 0}</p>
              <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(status => {
          const count = status === 'All' ? (Array.isArray(orders) ? orders.length : 0) : (statusCounts[status] || 0);
          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeStatus === status 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {status}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeStatus === status ? 'bg-white/20' : 'bg-slate-100'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by order ID or name..."
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
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex items-center justify-center gap-3 text-slate-400">
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    Loading orders...
                  </div>
                </td></tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map(order => {
                  const style = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                      <td className="px-6 py-5">
                        <span className="font-mono text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">#{order.id.slice(-8)}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                            {order.customer_name?.[0] || 'U'}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">{order.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">{order.items ? order.items.length : 0} items</span>
                      </td>
                      <td className="px-6 py-5 font-bold text-slate-900 text-sm">₹{order.total_amount}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-400 text-sm">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="7" className="px-6 py-16 text-center">
                  <Package size={32} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 font-medium text-sm">No orders found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <ShoppingBag className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Order #{selectedOrder.id.slice(-8)}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${getStatusStyle(selectedOrder.status).dot}`} />
                    <span className="text-slate-300 text-sm font-medium">{selectedOrder.status}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Progress Stepper */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-5 text-sm uppercase tracking-wider">Order Progress</h3>
                    <div className="flex items-center justify-between relative px-2">
                      <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-100" />
                      {statuses.slice(1).map((s, i) => {
                        const isPast = statuses.indexOf(selectedOrder.status) >= statuses.indexOf(s);
                        const isCurrent = selectedOrder.status === s;
                        return (
                          <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all text-sm font-bold ${
                              isPast ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'bg-white text-slate-300 border-2 border-slate-100'
                            }`}>
                              {isPast && !isCurrent ? <CheckCircle2 size={18} /> : <span>{i+1}</span>}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Items Ordered</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3 border-b border-white last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm border border-slate-100">{item.quantity}x</div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-400">₹{item.price} each</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-5 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Total</span>
                      <span className="text-2xl font-bold text-slate-900">₹{selectedOrder.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Customer</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-lg"><User size={16} className="text-slate-400" /></div>
                        <div><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Name</p><p className="font-semibold text-slate-900 text-sm">{selectedOrder.customer_name}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-lg"><CreditCard size={16} className="text-slate-400" /></div>
                        <div><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Payment</p><p className="font-semibold text-slate-900 text-sm">{selectedOrder.payment_method || 'Online'}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 rounded-lg"><Clock size={16} className="text-slate-400" /></div>
                        <div><p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Placed</p><p className="font-semibold text-slate-900 text-sm">{new Date(selectedOrder.created_at).toLocaleString('en-IN')}</p></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Update Status</p>
                    {statuses.slice(1).map((s) => {
                      if (statuses.indexOf(s) !== statuses.indexOf(selectedOrder.status) + 1) return null;
                      return (
                        <button 
                          key={s}
                          onClick={() => updateStatus(selectedOrder.id, s)}
                          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          Mark as {s} <ArrowRight size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
