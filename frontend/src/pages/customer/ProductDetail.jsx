import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Clock, 
  Star, 
  Leaf, 
  Flame, 
  Info,
  CheckCircle2,
  ChefHat
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`/menu/${id}`);

      setItem(res.data);
    } catch (err) {
      toast.error('Gourmet selection not found');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity, instructions);
    toast.success(`${item.name} added to your selection`, {
      style: {
        borderRadius: '20px',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)'
      }
    });

  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-bold text-accent uppercase tracking-[0.4em]">Loading menu item...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 animate-luxe">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] hover:text-accent transition-all uppercase tracking-[0.2em] group"
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all border border-[var(--border)]">
          <ArrowLeft size={16} />
        </div>
        Back to Menu
      </button>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <div className="flex-1 space-y-6">
          <div className="relative rounded-[3.5rem] overflow-hidden group shadow-2xl border border-[var(--border)]">
            <img 
              src={item.image_url} 
              alt={item.name} 
              className="w-full aspect-square object-cover transition-transform duration-[2s] group-hover:scale-110" 
            />
            <div className="absolute top-8 left-8 flex flex-col gap-3">
              {item.is_vegetarian && (
                <div className="flex items-center gap-3 bg-emerald-500/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20 text-white">
                  <Leaf size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Plant Based</span>
                </div>
              )}
              {item.is_spicy && (
                <div className="flex items-center gap-3 bg-rose-500/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20 text-white">
                   <Flame size={16} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Spicy</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-[var(--bg-secondary)] p-6 rounded-[2rem] border border-[var(--border)] flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                   <Clock size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-accent uppercase tracking-widest leading-none">Prep Time</p>
                   <p className="text-sm font-bold text-[var(--text-primary)] mt-1">20 - 30 MINS</p>
                </div>
             </div>
             <div className="bg-[var(--bg-secondary)] p-6 rounded-[2rem] border border-[var(--border)] flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-500">
                   <Star size={20} className="fill-amber-500" />
                </div>
                <div>
                   <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest leading-none">Rating</p>
                   <p className="text-sm font-bold text-[var(--text-primary)] mt-1">4.9 REVIEWS</p>
                </div>
             </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-10 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-lg border border-accent/20 italic">Signature Series</span>
              <span className="w-1 h-1 bg-[var(--border)] rounded-full" />
              <span className="text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.2em]">{item.category}</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] uppercase leading-none">{item.name}</h1>
            <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-xl">
              {item.description}
            </p>
          </div>

          <div className="space-y-6 bg-[var(--bg-secondary)] p-10 rounded-[3rem] border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">Item Price</span>
                <span className="text-4xl font-bold text-[var(--text-primary)] mt-1">₹{item.price}</span>
              </div>
              
              <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-2xl border border-[var(--border)] shadow-inner">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-accent/5 hover:text-accent transition-all text-[var(--text-secondary)]"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center text-xl font-bold text-[var(--text-primary)] tracking-tighter">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-accent/5 hover:text-accent transition-all text-[var(--text-secondary)]"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-2">
                 <ChefHat size={14} /> Special Instructions
              </div>
              <textarea 
                className="w-full p-6 bg-white dark:bg-stone-900 border border-[var(--border)] rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all text-sm font-medium h-24 resize-none placeholder:text-stone-300"
                placeholder="Ex: No cilantro, extra spice, medium rare..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full btn-luxe py-6 shadow-2xl shadow-accent/20 group uppercase tracking-[0.2em] text-xs"
            >
              <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" />
              Add To Cart - ₹{item.price * quantity}
            </button>
          </div>

          <div className="flex items-center gap-4 bg-accent/5 p-6 rounded-[2rem] border border-accent/10">
             <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
             </div>
             <p className="text-[10px] font-bold text-accent uppercase tracking-widest leading-relaxed">
                Guaranteed high quality and artisanal preparation for every order.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
