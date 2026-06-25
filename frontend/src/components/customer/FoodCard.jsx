import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star, Flame, Leaf, Clock, ArrowUpRight } from 'lucide-react';

const FoodCard = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${item.id}`)}
      style={{
        background: 'var(--bg-card)',
        borderRadius: '1.75rem',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--border)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 32px 64px rgba(45,35,24,0.14)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format'; }}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)' }} />

        {/* Diet badges */}
        <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {item.is_vegetarian && (
            <div style={{
              width: '32px', height: '32px',
              background: 'rgba(16,185,129,0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 12px rgba(16,185,129,0.35)'
            }}>
              <Leaf size={16} color="white" />
            </div>
          )}
          {item.is_spicy && (
            <div style={{
              width: '32px', height: '32px',
              background: 'rgba(239,68,68,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 12px rgba(239,68,68,0.35)'
            }}>
              <Flame size={16} color="white" />
            </div>
          )}
        </div>

        {/* Rating */}
        <div style={{
          position: 'absolute', top: '0.875rem', right: '0.875rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.3rem 0.7rem',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          borderRadius: '99px',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <Star size={12} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2D2318' }}>4.8</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#C0754A', padding: '0.2rem 0.6rem',
              background: 'rgba(192,117,74,0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(192,117,74,0.15)'
            }}>
              {item.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
              <Clock size={12} />
              <span>25–35 min</span>
            </div>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.15rem', fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0, lineHeight: 1.3,
            transition: 'color 0.2s ease'
          }}>
            {item.name}
          </h3>

          <p style={{
            fontSize: '0.8rem', color: 'var(--text-secondary)',
            margin: '0.5rem 0 0', lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {item.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.875rem', borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Price</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', fontStyle: 'italic' }}>₹{item.price}</div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}
            style={{
              width: '44px', height: '44px',
              background: 'linear-gradient(135deg, #C0754A, #A35E36)',
              color: 'white', border: 'none',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(192,117,74,0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Plus size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
