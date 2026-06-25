import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft,
  Receipt,
  Ticket,
  Tag
} from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center' }}>
        <div style={{ width: '120px', height: '120px', background: 'var(--bg-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
          <ShoppingBag size={48} color="var(--text-secondary)" strokeWidth={1.2} />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add some delicious dishes to get started!</p>
        </div>
        <Link to="/menu" className="btn-primary" style={{ textDecoration: 'none' }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  const cgst = Math.round(cartTotal * 0.025);
  const sgst = Math.round(cartTotal * 0.025);
  const deliveryFee = 40;
  const grandTotal = cartTotal + cgst + sgst + deliveryFee;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: 'var(--text-primary)', margin: '0 0 0.3rem' }}>
            Your Cart
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            {cart.reduce((t, i) => t + i.quantity, 0)} item{cart.reduce((t, i) => t + i.quantity, 0) !== 1 ? 's' : ''} selected
          </p>
        </div>
        <Link to="/menu" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '0.05em' }}>
          <ChevronLeft size={16} /> Continue Shopping
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '2rem' }} className="cart-grid">
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map((item) => (
            <div key={item.id + item.instructions} style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              background: 'var(--bg-card)', borderRadius: '1.5rem',
              padding: '1.25rem', border: '1px solid var(--border)',
              transition: 'box-shadow 0.2s ease'
            }}>
              {/* Image */}
              <div style={{ width: '80px', height: '80px', borderRadius: '1rem', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.category}</p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>₹{item.price} <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>each</span></p>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '99px', padding: '0.35rem 0.75rem', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.instructions, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '2px' }}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, width: '24px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.instructions, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex', padding: '2px' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', minWidth: '60px', textAlign: 'right' }}>₹{item.price * item.quantity}</p>

                <button
                  onClick={() => removeFromCart(item.id, item.instructions)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: '6px', display: 'flex', borderRadius: '8px', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background: '#1C1109', borderRadius: '2rem', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(192,117,74,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <Receipt size={20} color="#C0754A" />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#C0754A', margin: 0 }}>Order Summary</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Item Total</span>
              <span style={{ fontWeight: 600, color: 'white' }}>₹{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Delivery Fee</span>
              <span style={{ fontWeight: 600, color: 'white' }}>₹{deliveryFee}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.25rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>CGST (2.5%)</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>₹{cgst}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>SGST (2.5%)</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>₹{sgst}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Total GST (5%)</span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>₹{cgst + sgst}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.25rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C0754A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Grand Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>₹{grandTotal}</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Inclusive of all taxes</p>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              <Tag size={16} color="#C0754A" />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Apply coupon code</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #C0754A, #A35E36)', color: 'white', border: 'none', borderRadius: '0.875rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(192,117,74,0.35)', transition: 'transform 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .cart-grid { grid-template-columns: 1fr 380px !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
