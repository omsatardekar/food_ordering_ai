import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Utensils, ChevronLeft } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await signup(formData);
      toast.success('Account created successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden font-['Outfit']">
      {/* Photo Column */}
      <div className="hidden md:flex md:w-3/5 relative overflow-hidden group order-last">
        <img 
          src="/signup_bg.png" 
          alt="Fresh Ingredients"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute bottom-16 left-16 right-16 animate-entrance">
          <h2 className="text-6xl font-bold text-white leading-[1.1] mb-6">
            Join Us <br /> <span className="text-emerald-400">Eat Good Food</span>
          </h2>
          <p className="text-xl text-white/80 max-w-lg font-normal leading-relaxed">
            Create an account to start ordering delicious food and get exclusive deals.
          </p>
        </div>
      </div>

      {/* Signup Form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center px-10 lg:px-20 py-12 relative bg-slate-50 animate-zoom">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Utensils className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">FoodApp</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 text-lg">Join us and start ordering</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="name"
                  type="text"
                  className="input-lux pl-16 border-slate-200 shadow-sm"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  className="input-lux pl-16 border-slate-200 shadow-sm"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="password"
                  type="password"
                  className="input-lux pl-16 border-slate-200 shadow-sm"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="confirm_password"
                  type="password"
                  className="input-lux pl-16 border-slate-200 shadow-sm"
                  placeholder="Repeat password"
                  value={formData.confirm_password}
                  onChange={handleChange}
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
                'Creating account...'
              ) : (
                <>
                  Sign Up <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-800 font-bold underline underline-offset-8 transition-all">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
