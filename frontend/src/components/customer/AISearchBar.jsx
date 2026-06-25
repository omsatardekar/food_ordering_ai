import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AISearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/ai-results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const suggestions = [
    'Something spicy and vegetarian under 200',
    'Healthy light lunch',
    'Budget starter with paneer',
    'Sweet dish for after dinner',
    'Cold drink under 100',
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: '-4px',
          background: 'rgba(192,117,74,0.25)',
          borderRadius: '1.5rem',
          filter: 'blur(12px)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none'
        }} id="search-glow" />

        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.25rem',
          border: '1.5px solid rgba(255,255,255,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          padding: '0.5rem',
          gap: '0.5rem'
        }}>
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={22} color="#C0754A" />
          </div>
          <input
            type="text"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: '0.95rem', color: '#2D2318',
              fontFamily: "'Inter', sans-serif",
              padding: '0.75rem 0.5rem',
            }}
            placeholder="Tell our AI what you're craving..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => document.getElementById('search-glow').style.opacity = '1'}
            onBlur={() => document.getElementById('search-glow').style.opacity = '0'}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A6559', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <X size={18} />
            </button>
          )}
          <button type="submit" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #C0754A, #A35E36)',
            color: 'white', border: 'none', borderRadius: '1rem',
            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em',
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(192,117,74,0.4)',
            transition: 'transform 0.2s ease'
          }}>
            <Search size={16} />
            Discover
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.1em', display: 'flex', alignItems: 'center' }}>Try:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              // Small delay to allow state to update before navigating
              setTimeout(() => {
                navigate(`/ai-results?q=${encodeURIComponent(s)}`);
              }, 10);
            }}
            style={{
              padding: '0.35rem 0.9rem',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '99px',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.72rem', fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', sans-serif"
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(192,117,74,0.3)'; e.target.style.borderColor = 'rgba(192,117,74,0.5)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};


export default AISearchBar;
