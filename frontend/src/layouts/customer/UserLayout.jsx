import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, User, ShoppingBag, LogOut, UtensilsCrossed, ShoppingCart, Moon, Sun, Menu as MenuIcon
} from 'lucide-react';
import { useState } from 'react';

export const UserLayout = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
    { name: 'My Orders', path: '/my-orders', icon: ShoppingBag },
  ];

  const bg = isDark ? '#1A1511' : '#FDF8F4';
  const navBg = isDark ? 'rgba(26,21,17,0.92)' : 'rgba(253,248,244,0.92)';
  const textPrimary = isDark ? '#F5EDE4' : '#2D2318';
  const textMuted = isDark ? '#A89585' : '#7A6559';
  const border = isDark ? '#3D332A' : '#E8DDD4';
  const cardBg = isDark ? '#241E18' : '#FFFFFF';
  const accent = isDark ? '#D4855A' : '#C0754A';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: textPrimary, transition: 'background-color 0.5s ease, color 0.5s ease', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Navbar ── */}
      <nav style={{
        backgroundColor: navBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${border}`,
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.5s ease',
        boxShadow: `0 2px 24px rgba(0,0,0,0.06)`
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
            <div style={{
              width: '44px', height: '44px',
              background: `linear-gradient(135deg, ${accent}, #a35e36)`,
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 20px rgba(192,117,74,0.35)`,
              transition: 'transform 0.5s ease'
            }}>
              <UtensilsCrossed size={22} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.35rem', color: textPrimary, lineHeight: 1 }}>
                Food<span style={{ color: accent, fontStyle: 'italic' }}>App</span>
              </div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: textMuted, textTransform: 'uppercase', marginTop: '2px' }}>Heritage Cuisine</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem', background: isDark ? '#2E2620' : '#F5EDE4', borderRadius: '1rem', border: `1px solid ${border}` }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path === '/menu' && location.pathname.startsWith('/menu'));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.8rem', fontWeight: 600,
                    color: isActive ? 'white' : textMuted,
                    backgroundColor: isActive ? accent : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? `0 4px 12px rgba(192,117,74,0.3)` : 'none',
                    letterSpacing: '0.02em'
                  }}
                >
                  <link.icon size={15} strokeWidth={2} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '12px', border: `1px solid ${border}`,
                background: cardBg, color: textMuted,
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
              <div style={{
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '12px', border: `1px solid ${border}`,
                background: cardBg, color: textMuted,
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}>
                <ShoppingCart size={18} />
              </div>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  width: '20px', height: '20px',
                  background: accent, color: 'white',
                  fontSize: '0.65rem', fontWeight: 800,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${bg}`,
                  boxShadow: '0 2px 8px rgba(192,117,74,0.4)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: '12px', border: `1px solid ${border}`, background: cardBg, transition: 'all 0.2s ease' }}>
              <div style={{ width: '28px', height: '28px', background: `linear-gradient(135deg, ${accent}, #a35e36)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={15} color="white" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: textPrimary, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              style={{
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.06)', color: '#ef4444',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem 6rem' }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '2rem', textAlign: 'center', color: textMuted, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <UtensilsCrossed size={16} color={accent} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: textPrimary }}>FoodApp</span>
        </div>
        <p style={{ margin: 0 }}>© 2026 Heritage Cuisine Co. · Crafted with passion.</p>
      </footer>
    </div>
  );
};

export default UserLayout;
