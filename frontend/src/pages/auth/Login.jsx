import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ChefHat, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Welcome back! Logged in successfully.');
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Left Panel: Ambiance ── */}
      <div
        className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-end"
        style={{
          background: 'linear-gradient(135deg, #1a0f08 0%, #2d1a0e 40%, #3d2410 100%)',
          padding: '4rem',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(192,117,74,0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '-60px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(192,117,74,0.12) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        {/* Background food image overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/login_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          mixBlendMode: 'luminosity'
        }} />

        {/* Brand */}
        <div style={{ position: 'absolute', top: '3rem', left: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px', height: '48px', background: '#C0754A',
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(192,117,74,0.4)'
          }}>
            <ChefHat size={26} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1 }}>FoodApp</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Heritage Cuisine</div>
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', background: 'rgba(192,117,74,0.2)',
            borderRadius: '99px', border: '1px solid rgba(192,117,74,0.3)',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} color="#C0754A" />
            <span style={{ color: '#C0754A', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Artisanal Dining</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '4rem', fontWeight: 700,
            color: 'white', lineHeight: 1.1,
            marginBottom: '1.25rem'
          }}>
            Taste the Art<br />
            <span style={{ color: '#C0754A', fontStyle: 'italic' }}>of Fine Cuisine</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px' }}>
            Heritage recipes crafted with love and precision, delivered warm to your doorstep. Every bite tells a story.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[['4.9★', 'Rating'], ['30+', 'Menu Items'], ['45min', 'Avg Delivery']].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: "'Playfair Display', serif", color: '#C0754A', fontSize: '1.5rem', fontWeight: 700 }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        background: '#FDF8F4',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background texture */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(192,117,74,0.06) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ width: '100%', maxWidth: '420px', animation: 'scaleIn 0.6s ease forwards', position: 'relative', zIndex: 1 }}>
          {/* Mobile brand */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '42px', height: '42px', background: '#C0754A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={22} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2D2318' }}>FoodApp</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700, color: '#2D2318', marginBottom: '0.5rem' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#7A6559', fontSize: '0.9rem' }}>Sign in to order your favourite food</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2D2318', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#C0754A" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '3rem' }}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2D2318', letterSpacing: '0.03em' }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: '#C0754A', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#C0754A" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field"
                  style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7A6559' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E8DDD4' }}>
            <p style={{ color: '#7A6559', fontSize: '0.875rem' }}>
              New to FoodApp?{' '}
              <Link to="/signup" style={{ color: '#C0754A', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default Login;
