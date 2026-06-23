import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, User, ShoppingBag, UtensilsCrossed, Bell } from 'lucide-react';

export const UserLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="nav-blur h-24 flex items-center border-b border-slate-100">
        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">FoodApp</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-[15px] font-semibold text-slate-900 border-b-2 border-emerald-500 pb-1">Dashboard</Link>
              <Link to="#" className="text-[15px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors">Menu</Link>
              <Link to="#" className="text-[15px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors">Orders</Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-slate-400" />
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-8 md:px-12 py-12 animate-entrance">
        <Outlet />
      </main>
    </div>
  );
};

export const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-slate-900 h-24 flex items-center sticky top-0 z-50">
        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-tight">Admin Dashboard</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-12">
            <div className="flex items-center gap-8">
              <Link to="/admin/dashboard" className="text-[15px] font-semibold text-white">Home</Link>
              <Link to="#" className="text-[15px] font-semibold text-white/50 hover:text-white transition-colors">Users</Link>
              <Link to="#" className="text-[15px] font-semibold text-white/50 hover:text-white transition-colors">Settings</Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{user?.name}</span>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-white/40" />
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-8 md:px-12 py-12 animate-entrance">
        <Outlet />
      </main>
    </div>
  );
};
