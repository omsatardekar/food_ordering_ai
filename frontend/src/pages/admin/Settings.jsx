import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, AppWindow, Database, Check } from 'lucide-react';
import axios from '../../services/api';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/profile');
      setProfile({ name: res.data.name, email: res.data.email });
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.put('/profile', { name: profile.name, email: profile.email });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm) {
      return toast.error('New passwords do not match');
    }
    try {
      await axios.put('/profile/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ current_password: '', new_password: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to change password');
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">...</div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Settings</h1>
          <p className="text-slate-500 font-light">Manage your profile and admin preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><AppWindow size={24} /></div>
              Profile Information
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                  <input 
                    type="text" 
                    className="input-lux" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Admin Email</label>
                  <input 
                    type="email" 
                    className="input-lux" 
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  {savingProfile ? 'Saving...' : <><Check size={18} /> Save Settings</>}
                </button>
              </div>
            </form>
          </section>

          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm opacity-60 pointer-events-none">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Bell size={24} /></div>
              Notifications (Global)
            </h3>
            <div className="space-y-6">
              {[
                { label: 'System Alerts', desc: 'Notify me when orders are pending for too long.' },
                { label: 'Inventory Updates', desc: 'Daily summary of out-of-stock items.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                  <div><p className="font-bold text-slate-900">{item.label}</p><p className="text-sm text-slate-400 font-medium">{item.desc}</p></div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                    <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
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
             <p className="text-slate-400 mb-8 leading-relaxed font-light">Last password change: 2 months ago. Keep it secure.</p>
             <button 
               onClick={() => setShowPasswordModal(true)}
               className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all text-sm"
             >
               Change Password
             </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <Database className="text-slate-200 w-12 h-12 mb-6" />
             <h3 className="text-2xl font-bold text-slate-900 mb-4 text-xl">System Export</h3>
             <p className="text-slate-400 text-xs mb-8 leading-relaxed font-medium">Backup your menu and order database to a CSV file for offline auditing.</p>
             <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest cursor-not-allowed">Coming Soon</button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Change Password</h2>
            <p className="text-slate-400 text-sm mb-8">Enter your current password to continue.</p>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password" 
                  className="input-lux" 
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  required 
                />
              </div>
              <hr className="border-slate-50 my-6" />
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                <input 
                  type="password" 
                  className="input-lux" 
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                <input 
                  type="password" 
                  className="input-lux" 
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  required 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-xl font-bold text-sm transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm transition-all hover:bg-blue-600 shadow-lg shadow-slate-900/20">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
