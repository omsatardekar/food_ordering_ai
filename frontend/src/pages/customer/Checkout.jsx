import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_mobile: '',
    delivery_address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setLoading(true);
      const orderPayload = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          instructions: item.instructions
        })),
        total_amount: cartTotal,
        payment_method: paymentMethod,
        customer_name: formData.customer_name,
        customer_mobile: formData.customer_mobile,
        delivery_address: formData.delivery_address
      };

      const res = await axios.post('/orders', orderPayload);
      toast.success('Order Placed Successfully', {
        style: { borderRadius: '20px', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }
      });
      clearCart();
      navigate(`/order-success/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-luxe max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] hover:text-accent transition-all uppercase tracking-[0.2em] group"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all border border-[var(--border)]">
          <ArrowLeft size={16} />
        </div>
        Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Checkout Form */}
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-[var(--text-primary)] uppercase leading-none">Checkout</h1>
            <p className="text-[var(--text-secondary)] text-sm font-light max-w-md leading-loose">
              Enter your delivery details and choose how you'd like to pay.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Delivery Info */}
            <div className="space-y-8 bg-[var(--bg-secondary)] p-10 rounded-[3rem] border border-[var(--border)] shadow-2xl shadow-accent/5">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.4em] flex items-center gap-4 border-b border-[var(--border)] pb-8">
                 <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                    <MapPin size={18} />
                 </div>
                 Delivery Details
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-4">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-700 group-focus-within:text-accent" size={18} />
                    <input 
                      type="text"
                      className="w-full pl-16 pr-6 py-5 bg-white dark:bg-stone-900 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-sm text-[var(--text-primary)]"
                      placeholder="Your full name"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-4">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-700 group-focus-within:text-accent" size={18} />
                    <input 
                      type="tel"
                      className="w-full pl-16 pr-6 py-5 bg-white dark:bg-stone-900 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-sm text-[var(--text-primary)]"
                      placeholder="Verified mobile identifier"
                      required
                      value={formData.customer_mobile}
                      onChange={(e) => setFormData({...formData, customer_mobile: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest ml-4">Delivery Address</label>
                  <textarea 
                    className="w-full p-6 bg-white dark:bg-stone-900 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all font-medium text-sm text-[var(--text-primary)] h-32 resize-none leading-relaxed"
                    placeholder="Enter your full address with landmarks..."
                    required
                    value={formData.delivery_address}
                    onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6 bg-gradient-to-br from-[var(--bg-secondary)] to-white dark:to-stone-900 p-8 rounded-[2.5rem] border border-[var(--border)] shadow-xl shadow-accent/5">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-[0.4em] flex items-center gap-4 border-b border-[var(--border)] pb-8">
                 <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                    <CreditCard size={18} />
                 </div>
                 Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('Online')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                    paymentMethod === 'Online' 
                    ? 'border-accent bg-accent/5 shadow-lg' 
                    : 'border-[var(--border)] bg-white dark:bg-stone-900 hover:border-accent/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    paymentMethod === 'Online' ? 'bg-accent text-white scale-110' : 'bg-[var(--bg-secondary)] text-stone-400'
                  }`}>
                    <Lock size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)] text-sm tracking-tight uppercase">Pay Online</div>
                    <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest font-bold mt-1">Visa / Master / UPI</div>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('CoD')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                    paymentMethod === 'CoD' 
                    ? 'border-accent bg-accent/5 shadow-lg' 
                    : 'border-[var(--border)] bg-white dark:bg-stone-900 hover:border-accent/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    paymentMethod === 'CoD' ? 'bg-accent text-white scale-110' : 'bg-[var(--bg-secondary)] text-stone-400'
                  }`}>
                    <Banknote size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)] text-sm tracking-tight uppercase">Cash on Delivery</div>
                    <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-widest font-bold mt-1">Pay at door</div>
                  </div>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all shadow-xl shadow-accent/30 flex justify-center items-center gap-2 uppercase tracking-widest disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                {loading ? 'Processing...' : `Place Order - ₹${cartTotal + 40 + Math.round(cartTotal * 0.05)}`}
                {!loading && <CheckCircle2 size={18} className="group-hover:translate-x-1" />}
              </div>
            </button>
          </form>
        </section>

        {/* Order Review Sidebar */}
        <section className="space-y-8">
           <div className="bg-stone-950 text-white rounded-[3rem] p-10 space-y-10 sticky top-32 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
              
              <h3 className="text-xs font-bold text-accent border-b border-white/5 pb-8 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                 Order Review
              </h3>
              
              <div className="space-y-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar-white">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center gap-6 group/item">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden shrink-0 border border-white/10 group-hover/item:border-accent/40 transition-colors">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale-[30%] group-hover/item:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-xs tracking-tight uppercase group-hover/item:text-accent transition-colors">{item.name}</div>
                        <div className="text-[9px] font-medium text-white/40 uppercase tracking-widest">{item.quantity} Servings</div>
                      </div>
                    </div>
                    <div className="font-bold text-lg tracking-tighter italic text-accent/80">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  <span>Item Total</span>
                  <span className="text-white font-bold text-sm tracking-tight italic">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span className="text-white font-bold text-sm">₹40</span>
                </div>
                <div className="flex justify-between items-center text-white/20 text-[9px] font-bold uppercase tracking-widest">
                  <span>CGST (2.5%)</span>
                  <span>₹{Math.round(cartTotal * 0.025)}</span>
                </div>
                <div className="flex justify-between items-center text-white/20 text-[9px] font-bold uppercase tracking-widest">
                  <span>SGST (2.5%)</span>
                  <span>₹{Math.round(cartTotal * 0.025)}</span>
                </div>
                <div className="flex justify-between items-center pt-10 border-t border-white/5">
                  <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] italic">Grand Total</span>
                  <span className="text-5xl font-bold text-accent tracking-tighter italic">₹{cartTotal + 40 + Math.round(cartTotal * 0.05)}</span>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-[9px] font-bold text-white/30 leading-relaxed uppercase tracking-widest text-center italic">
                   Your payment is secure and encrypted.
                </p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Checkout;
