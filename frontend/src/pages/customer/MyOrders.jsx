import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Receipt, 
  CheckCircle2, 
  Package,
  History,
  TrendingUp,
  Search
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Preparing': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-accent bg-accent/10 border-accent/20';
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-luxe">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
               <History size={20} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] uppercase">My Orders</h1>
          </div>
          <p className="text-[var(--text-secondary)] text-sm font-light uppercase tracking-widest pl-2">View your past orders and their status.</p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">Total Orders</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tracking-tighter">{orders.length}</p>
           </div>
           <div className="h-10 w-[1px] bg-[var(--border)]" />
           <div className="text-right">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">Status</p>
              <p className="text-2xl font-bold text-emerald-500 mt-1 tracking-tighter">Active</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-[var(--bg-secondary)] rounded-[2.5rem] animate-pulse border border-[var(--border)]" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-8 glass-card">
          <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-stone-300">
             <Package size={48} strokeWidth={1} />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tighter italic">No Orders Yet</h3>
            <p className="text-[var(--text-secondary)] font-light text-sm uppercase tracking-widest">You haven't placed any orders yet.</p>
          </div>
          <Link to="/menu" className="btn-luxe py-4 uppercase tracking-[0.2em] text-[10px]">
            Order Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="group bg-[var(--bg-secondary)] rounded-[3rem] border border-[var(--border)] overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
            >
              <div className="p-10 flex flex-col lg:flex-row gap-10">
                {/* Order Meta */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-accent uppercase tracking-widest leading-none">Order ID</p>
                      <h4 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tighter">#{order.id.slice(-8).toUpperCase()}</h4>
                    </div>
                    <div className={`px-5 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        <Clock size={12} /> Registered
                      </div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{format(new Date(order.created_at), 'MMMM do, yyyy')}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        <Receipt size={12} /> Total Amount
                      </div>
                      <p className="text-xl font-bold text-accent italic tracking-tighter">₹{order.total_amount}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      <MapPin size={12} /> Delivery Address
                    </div>
                    <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed italic truncate">
                      {order.delivery_address}
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] bg-[var(--border)]" />

                {/* Items Preview */}
                <div className="flex-[1.5] space-y-6">
                   <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      <TrendingUp size={14} className="text-accent" /> Items
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-[var(--border)] group/item">
                           <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center text-[10px] font-bold text-stone-400 group-hover/item:bg-accent group-hover/item:text-white transition-all">
                              {item.quantity}x
                           </div>
                           <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold text-[var(--text-primary)] truncate uppercase tracking-tight">{item.name}</p>
                            </div>
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex items-center justify-center bg-accent/5 p-4 rounded-2xl border border-accent/10 border-dashed">
                           <p className="text-[10px] font-bold text-accent uppercase tracking-widest">+{order.items.length - 4} More Items</p>
                        </div>
                      )}
                   </div>
                   
                   <div className="flex justify-end pt-4">
                      <Link 
                        to={`/track-order/${order.id}`}
                        className="flex items-center gap-3 px-8 py-3 bg-[var(--bg-primary)] dark:bg-stone-950 text-accent border border-accent/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all shadow-lg active:scale-95"
                      >
                         Track Order <ChevronRight size={14} />
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
