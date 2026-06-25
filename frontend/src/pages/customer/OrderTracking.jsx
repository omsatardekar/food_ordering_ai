import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../services/api';
import { 
  Package, 
  ChefHat, 
  Truck, 
  MapPin, 
  ArrowLeft,
  Clock,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Bell
} from 'lucide-react';

const STEPS = [
  { status: 'Placed', icon: Bell, label: 'Order Placed', desc: 'Order received by the restaurant' },
  { status: 'Confirmed', icon: CheckCircle2, label: 'Confirmed', desc: 'Restaurant has accepted your order' },
  { status: 'Preparing', icon: ChefHat, label: 'Preparing', desc: 'Chefs are preparing your meal' },
  { status: 'Ready', icon: Package, label: 'Ready for Pickup', desc: 'Order is ready for dispatch' },
  { status: 'Picked Up', icon: Truck, label: 'Out for Delivery', desc: 'Delivery partner is on the way' }
];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const res = await axios.get(`/orders/${id}/tracking`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (isManual) setTimeout(() => setRefreshing(false), 500);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const currentStepIndex = STEPS.findIndex(s => s.status === order?.status);

  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto animate-luxe">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <Link to="/my-orders" className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] hover:text-accent transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all border border-[var(--border)]">
            <ArrowLeft size={16} />
          </div>
          Back to My Orders
        </Link>
        <button 
          onClick={() => fetchStatus(true)}
          disabled={refreshing}
          className="flex items-center gap-3 text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em] hover:text-accent transition-colors"
        >
          <RotateCw size={14} className={refreshing ? 'animate-spin text-accent' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      <section className="bg-[var(--bg-secondary)] rounded-[3.5rem] p-12 border border-[var(--border)] shadow-2xl shadow-accent/5 space-y-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-[var(--border)] pb-12 text-center md:text-left relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] uppercase">Order Tracking</h1>
            <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest">
              Order ID: <span className="text-[var(--text-primary)] font-black tracking-normal border-b border-accent/30 mx-2">#{id.slice(-8).toUpperCase()}</span>
            </p>
          </div>
          <div className="bg-white dark:bg-stone-900 border border-[var(--border)] px-10 py-6 rounded-[2.5rem] space-y-1.5 shadow-xl shadow-accent/5">
             <div className="text-[9px] font-bold text-accent uppercase tracking-[0.4em]">Current Status</div>
             <div className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tighter">{order?.status}</div>
          </div>
        </div>

        {/* Vertical Tracker */}
        <div className="relative space-y-16 pl-6 lg:pl-12">
          {/* Progress Bar Line */}
          <div className="absolute left-[54px] lg:left-[78px] top-10 bottom-10 w-1 bg-[var(--bg-primary)] hidden md:block rounded-full">
            <div 
              className="w-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgba(159,18,57,0.3)]" 
              style={{ height: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={index} className={`flex items-start gap-12 lg:gap-16 group transition-all duration-700 ${isCompleted ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-[2rem] flex items-center justify-center shrink-0 z-10 transition-all duration-1000 border ${
                  isCompleted 
                  ? 'bg-accent text-white border-transparent shadow-xl scale-110' 
                  : 'bg-[var(--bg-primary)] text-stone-300 border-[var(--border)]'
                }`}>
                  <Icon size={isActive ? 32 : 24} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <div className="space-y-2 pt-3 lg:pt-6">
                  <h3 className={`text-xl font-bold transition-all duration-700 uppercase tracking-tight ${isActive ? 'text-accent scale-105 origin-left' : 'text-[var(--text-primary)]'}`}>
                    {step.label}
                    {isActive && (
                      <span className="ml-6 text-[8px] font-bold uppercase bg-accent text-white px-3 py-1 rounded-full animate-bounce-subtle tracking-widest shadow-lg shadow-accent/20">
                        Live Now
                      </span>
                    )}
                  </h3>
                  <p className="text-[var(--text-secondary)] font-light text-sm uppercase tracking-widest">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-stone-950 p-12 rounded-[3.5rem] space-y-6 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
           <div className="flex items-center gap-3 text-white/30 uppercase tracking-[0.4em] text-[9px] font-bold">
              <Clock size={16} className="text-accent" /> Estimated Delivery
           </div>
           <div className="text-4xl font-bold text-white tracking-tighter">20 - 30 MINS</div>
           <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">Your order is on track to arrive soon.</p>
        </div>
        <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-white dark:to-stone-900 p-12 rounded-[3.5rem] space-y-6 shadow-xl border border-[var(--border)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
           <div className="flex items-center gap-3 text-stone-400 uppercase tracking-[0.4em] text-[9px] font-bold">
              <MapPin size={16} className="text-accent" /> Delivery Address
           </div>
           <div className="text-2xl font-bold text-[var(--text-primary)] tracking-tighter uppercase truncate">Verified Address</div>
           <p className="text-[var(--text-secondary)] text-[9px] font-bold uppercase tracking-[0.2em] leading-loose truncate">{order?.delivery_address || 'In transit...'}</p>
        </div>
      </section>
    </div>
  );
};

export default OrderTracking;
