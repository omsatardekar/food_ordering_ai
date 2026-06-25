import React from 'react';
import { UtensilsCrossed, Clock, Star, MapPin } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-12">
      <div className="bg-slate-900 text-white rounded-[3rem] p-16 overflow-hidden relative shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-6xl font-black mb-6 leading-tight">Order something <span className="text-emerald-400">delicious</span> today.</h1>
          <p className="text-slate-400 text-xl font-light mb-10 leading-relaxed">Delicious meals, prepared with love and delivered fresh to your door. Browse our menu and find your new favorite dish.</p>
          <button className="px-10 py-5 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-3">
             View Our Menu <UtensilsCrossed size={20} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-bold text-slate-900">Featured Categories</h2>
           <button className="text-emerald-600 font-bold hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Main Course', 'Desserts', 'Starters', 'Drinks'].map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 text-center hover:shadow-xl transition-all cursor-pointer group">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-50 transition-colors">
                  <UtensilsCrossed className="text-slate-400 group-hover:text-emerald-500" />
               </div>
               <p className="font-bold text-slate-800">{cat}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Clock className="text-emerald-500" /> Recent Activities
              </h3>
           </div>
           <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="font-bold text-slate-900">Your last order is being prepared!</p>
                 <p className="text-sm text-slate-500">Chicken Tikka & Garlic Naan</p>
                 <div className="mt-4 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-emerald-500" />
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100">
           <h3 className="text-2xl font-bold text-slate-900 mb-6 font-['Inter']">Offers for you</h3>
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 bg-emerald-500 text-white rounded-bl-3xl font-bold text-xs uppercase tracking-widest">OFFER</div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Discount Code</p>
              <h4 className="text-4xl font-black text-slate-900 mb-4">50% OFF</h4>
              <p className="text-slate-500 font-medium mb-8">Use code <span className="text-emerald-600 font-bold">WELCOME50</span> on your first order above $20.</p>
              <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all">Claim Now</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
