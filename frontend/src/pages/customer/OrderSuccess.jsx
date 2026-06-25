import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ArrowRight, PackageCheck, ReceiptText, Sparkles, CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] space-y-16 animate-luxe text-center max-w-2xl mx-auto py-24">
      <div className="relative group">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-[100px] opacity-50 scale-150 animate-pulse group-hover:scale-[2] transition-transform duration-1000" />
        <div className="w-56 h-56 bg-stone-950 text-accent rounded-[4rem] flex items-center justify-center shadow-2xl relative z-10 border-8 border-[var(--bg-primary)] group-hover:rotate-6 transition-transform duration-700">
          <CheckCircle size={112} strokeWidth={1} className="animate-zoom-in" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 text-accent transition-all animate-bounce-subtle">
           <Sparkles size={20} />
           <span className="text-xs font-bold uppercase tracking-[0.6em]">Exquisite Commencement</span>
        </div>
        <h1 className="text-6xl lg:text-7xl font-bold text-[var(--text-primary)] tracking-tighter uppercase leading-none italic">Grand Success</h1>
        <p className="text-lg text-[var(--text-secondary)] font-light px-8 tracking-tight max-w-md mx-auto">
          A masterpiece is being synthesized for you. Reservation <span className="text-accent font-bold italic border-b border-accent/30 mx-1">#{id.slice(-8).toUpperCase()}</span> is confirmed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full px-8">
        <Link to={`/track-order/${id}`} className="group p-10 bg-stone-950 text-white rounded-[3rem] flex flex-col items-start gap-10 shadow-2xl hover:scale-[1.05] transition-all duration-700 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/20 transition-all duration-1000" />
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
            <Truck size={32} className="text-accent" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold uppercase tracking-tighter">Live Tracker</h3>
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.3em]">Temporal Awareness Active</p>
          </div>
          <ArrowRight className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-3 text-accent" size={28} />
        </Link>

        <Link to="/my-orders" className="group p-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[3rem] flex flex-col items-start gap-10 shadow-xl hover:scale-[1.05] transition-all duration-700 relative overflow-hidden text-left">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all duration-1000" />
          <div className="w-14 h-14 bg-accent/5 text-accent rounded-2xl flex items-center justify-center shrink-0 border border-accent/10">
            <ReceiptText size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tighter">The Archives</h3>
            <p className="text-[var(--text-secondary)] text-[9px] font-bold uppercase tracking-[0.3em]">Historical Receipts</p>
          </div>
          <ArrowRight className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-3 text-accent" size={28} />
        </Link>
      </div>

      <div className="pt-16 flex flex-col items-center gap-10">
         <Link to="/" className="text-[var(--text-secondary)] font-bold hover:text-accent transition-all uppercase tracking-[0.5em] text-[10px] hover:tracking-[0.6em]">
            Return to Exhibition
         </Link>
         <div className="flex items-center gap-4 bg-[var(--bg-secondary)] px-8 py-4 rounded-full text-stone-400 font-bold text-[8px] uppercase tracking-[0.4em] border border-[var(--border)] shadow-sm">
            <PackageCheck size={16} className="text-accent" /> Michelin Grade Hygiene Standards Verified
         </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
