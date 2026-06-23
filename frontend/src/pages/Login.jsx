import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, UtensilsCrossed, ChevronLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Login successful');
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden font-['Outfit']">
      {/* Left Column: Food Image */}
      <div className="hidden md:flex md:w-3/5 relative overflow-hidden group">
        <img 
          src="/login_bg.png" 
          alt="Delicious Food"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute bottom-16 left-16 right-16 animate-entrance">
          <h2 className="text-6xl font-bold text-white leading-[1.1] mb-6">
            Fresh Food <br /> <span className="text-emerald-400">Delivered to You</span>
          </h2>
          <p className="text-xl text-white/80 max-w-lg font-normal leading-relaxed">
            Order your favorite meals from the best restaurants in town. Fast, fresh, and easy.
          </p>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center px-10 lg:px-20 py-12 relative bg-slate-50">
        <div className="max-w-md w-full mx-auto animate-zoom">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">FoodApp</span>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-lg">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  className="input-lux pl-16 border-slate-200 shadow-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-bold text-emerald-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  className="input-lux pl-16 border-slate-200 shadow-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-immersive w-full mt-8"
            >
              {loading ? (
                'Logging in...'
              ) : (
                <>
                  Login <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 hover:text-emerald-800 font-bold underline underline-offset-8 transition-all">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
