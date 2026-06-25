import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  ShoppingBasket, 
  ShoppingBag, 
  Settings, 
  Home, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  ChevronRight,
  User,
  UtensilsCrossed
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Food Menu', path: '/admin/menu', icon: ShoppingBasket },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Reports', path: '/admin/analytics', icon: Home },
    { name: 'App Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
          isSidebarCollapsed ? 'w-24' : 'w-72'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-24 flex items-center px-6 border-b border-white/10 overflow-hidden shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <UtensilsCrossed className="text-white w-6 h-6" />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white leading-tight">AdminPanel</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">Management</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 font-bold' 
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={22} className={`shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                  {!isSidebarCollapsed && <span className="text-[15px]">{item.name}</span>}
                  {!isSidebarCollapsed && isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <button 
              onClick={logout}
              className={`flex items-center gap-4 p-4 w-full rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all ${
                isSidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut size={22} className="shrink-0" />
              {!isSidebarCollapsed && <span className="text-[15px] font-bold">Log Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-72'}`}>
        {/* Top Navbar */}
        <header className="h-24 bg-white border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
          >
            {isSidebarCollapsed ? <MenuIcon size={24} /> : <X size={24} />}
          </button>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 line-clamp-1">{user?.name}</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{user?.role}</span>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden">
                <User size={24} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-10 animate-entrance max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
