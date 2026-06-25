import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, AppWindow, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Settings</h1>
        <p className="text-slate-500">Manage your profile and app preferences here.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><AppWindow size={24} /></div>
              Restaurant Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Restaurant Name</label>
                <input type="text" className="input-lux" defaultValue="Gourmet Kitchen" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Support Email</label>
                <input type="email" className="input-lux" defaultValue="contact@gourmet.io" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Address</label>
                <textarea className="input-lux h-24 resize-none" defaultValue="Main Street, City Center" />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Bell size={24} /></div>
              Notifications
            </h3>
            <div className="space-y-6">
              {[
                { label: 'New Order Alerts', desc: 'Get notified when a customer places a new order.' },
                { label: 'Inventory Alerts', desc: 'Tell me when we are running out of ingredients.' },
                { label: 'Updates', desc: 'Notify me about new site features.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-xl">
             <Shield className="text-emerald-400 w-12 h-12 mb-6" />
             <h3 className="text-2xl font-bold mb-4">Security</h3>
             <p className="text-slate-400 mb-8 leading-relaxed">Keep your account safe. We recommend changing your password every few months.</p>
             <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">Change Password</button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <Database className="text-slate-300 w-12 h-12 mb-6" />
             <h3 className="text-2xl font-bold text-slate-900 mb-4">Export Data</h3>
             <p className="text-slate-500 text-sm mb-8 leading-relaxed">Save your order history and menu data to your computer.</p>
             <button className="w-full py-4 border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-2xl font-bold transition-all">Download CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
