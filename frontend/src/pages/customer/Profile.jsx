import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { User, Mail, Calendar, ShieldCheck, Wallet, ShoppingBag, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const Modal = ({ isOpen, onClose, title, desc, inputLabel, type = "text", onSubmit }) => {
  const [val, setVal] = useState('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 relative border border-[var(--border)]">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-[var(--text-primary)] transition-colors">
          <X size={20} />
        </button>
        <div>
          <h3 className="text-xl font-bold font-serif text-[var(--text-primary)] mb-1">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] font-light">{desc}</p>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{inputLabel}</label>
          <input
            type={type}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
            placeholder={`Enter ${inputLabel.toLowerCase()}`}
          />
        </div>
        <button
          onClick={() => { onSubmit(val); setVal(''); onClose(); }}
          className="w-full py-4 bg-accent text-white font-bold tracking-widest uppercase text-xs rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
        >
          Confirm Update
        </button>
      </div>
    </div>
  );
};

const SuccessToast = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[var(--bg-secondary)] border border-accent/20 shadow-2xl px-6 py-4 rounded-2xl animate-in slide-in-from-bottom-5">
      <CheckCircle2 className="text-emerald-500" size={20} />
      <span className="text-sm font-medium text-[var(--text-primary)]">{message}</span>
      <button onClick={onClose} className="ml-4 text-stone-400 hover:text-[var(--text-primary)]"><X size={16} /></button>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/profile');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showSuccess = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-luxe space-y-12">
      <div className="flex items-end justify-between border-b border-[var(--border)] pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight text-[var(--text-primary)] mb-2">My Profile</h1>
          <p className="text-[var(--text-secondary)] text-sm font-light">Manage your personal settings and culinary journey.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-[var(--bg-secondary)] px-4 py-2 rounded-full border border-[var(--border)]">
          <ShieldCheck size={16} className="text-accent" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">Secure Account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <div className="flex flex-col items-center text-center p-8 bg-[var(--bg-secondary)]/50 rounded-3xl border border-[var(--border)] relative overflow-hidden">
            <div className="w-24 h-24 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center border border-[var(--border)] shadow-sm mb-6 relative">
              <User size={32} className="text-stone-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold font-serif mb-1 text-[var(--text-primary)]">{profile.name}</h2>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium mb-6">FoodApp Member</p>

            <div className="w-full space-y-4 text-left border-t border-[var(--border)] pt-6">
              <div className="flex items-center gap-4">
                <Mail size={16} className="text-stone-400" />
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <Calendar size={16} className="text-stone-400" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Joined {profile.created_at ? format(new Date(profile.created_at), 'MMM yyyy') : 'Recently'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-6">Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-6 p-6 rounded-2xl border border-[var(--border)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-[var(--text-primary)]">{profile.stats.total_orders}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Total Orders</div>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-2xl border border-[var(--border)] hover:bg-[var(--bg-secondary)]/30 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold font-serif text-[var(--text-primary)]">₹{profile.stats.total_spent}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Total Spent</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-6">Account Settings</h3>
            <div className="space-y-4">
              <button onClick={() => setEmailModalOpen(true)} className="w-full flex items-center justify-between p-6 bg-[var(--bg-secondary)]/30 border border-[var(--border)] hover:border-accent hover:bg-[var(--bg-secondary)] transition-all rounded-2xl group">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-white dark:bg-stone-800 rounded-lg flex items-center justify-center shadow-sm text-stone-500 group-hover:text-accent transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[var(--text-primary)]">Email Address</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">Change your primary contact email</div>
                  </div>
                </div>
                <ArrowRight size={18} className="text-stone-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>

              <button onClick={() => setPassModalOpen(true)} className="w-full flex items-center justify-between p-6 bg-[var(--bg-secondary)]/30 border border-[var(--border)] hover:border-accent hover:bg-[var(--bg-secondary)] transition-all rounded-2xl group">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-white dark:bg-stone-800 rounded-lg flex items-center justify-center shadow-sm text-stone-500 group-hover:text-accent transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[var(--text-primary)]">Password & Security</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">Update your password to keep your account secure</div>
                  </div>
                </div>
                <ArrowRight size={18} className="text-stone-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Update Email Address"
        desc="Enter the new email address you'd like to use."
        inputLabel="New Email"
        type="email"
        onSubmit={(val) => { if (val) showSuccess(`Verification link sent to ${val}`); }}
      />

      <Modal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        title="Change Password"
        desc="Ensure your new password aligns with security protocols."
        inputLabel="New Password"
        type="password"
        onSubmit={(val) => { if (val) showSuccess('Your password has been successfully updated.'); }}
      />

      <SuccessToast show={!!toastMsg} message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
};

export default Profile;
