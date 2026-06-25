import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, ChefHat, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(formData);
      toast.success('Account created! Welcome to FoodApp.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Access 30+ curated heritage dishes',
    'Real-time order tracking',
    'Exclusive member-only discounts',
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Right Panel: Form (comes first on mobile) ── */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        background: '#FDF8F4',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(192,117,74,0.06) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ width: '100%', maxWidth: '440px', animation: 'scaleIn 0.6s ease forwards', position: 'relative', zIndex: 1 }}>
          {/* Mobile brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ width: '42px', height: '42px', background: '#C0754A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={22} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2D2318' }}>FoodApp</span>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700, color: '#2D2318', marginBottom: '0.5rem' }}>
              Create Account
            </h2>
            <p style={{ color: '#7A6559', fontSize: '0.9rem' }}>Create your account and start ordering in 2 minutes</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2D2318', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#C0754A" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" name="name" className="input-field" style={{ paddingLeft: '3rem' }} placeholder="Your full name" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2D2318', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#C0754A" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" name="email" className="input-field" style={{ paddingLeft: '3rem' }} placeholder="your@email.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2D2318', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#C0754A" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPass ? 'text' : 'password'} name="password" className="input-field" style={{ paddingLeft: '3rem', paddingRight: '3rem' }} placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7A6559' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2D2318', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#C0754A" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" name="confirm_password" className="input-field" style={{ paddingLeft: '3rem' }} placeholder="Repeat password" value={formData.confirm_password} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '1rem' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Creating account...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Create Account <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E8DDD4' }}>
            <p style={{ color: '#7A6559', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#C0754A', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Left Panel: Perks ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a0f08 0%, #2d1a0e 50%, #3d2410 100%)',
          padding: '5rem 4rem',
          order: -1
        }}
      >
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(192,117,74,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '48px', height: '48px', background: '#C0754A', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(192,117,74,0.4)' }}>
            <ChefHat size={26} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1 }}>FoodApp</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Heritage Cuisine</div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', background: 'rgba(192,117,74,0.2)',
            borderRadius: '99px', border: '1px solid rgba(192,117,74,0.3)', marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} color="#C0754A" />
            <span style={{ color: '#C0754A', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Members Only</span>
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Start Ordering<br />
            <span style={{ color: '#C0754A', fontStyle: 'italic' }}>Great Food Today</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Sign up and get access to 30+ freshly prepared dishes, real-time order tracking, and exclusive member deals.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(192,117,74,0.2)', border: '1px solid rgba(192,117,74,0.4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle size={18} color="#C0754A" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{perk}</span>
              </div>
            ))}
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

export default Signup;
