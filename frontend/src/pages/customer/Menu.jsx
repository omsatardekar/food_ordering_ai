import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import FoodCard from '../../components/customer/FoodCard';
import { Search, X, ChefHat, Filter, UtensilsCrossed } from 'lucide-react';

const Menu = () => {
  const { search: urlSearch } = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Veg Starters',
    'Non-Veg Starters',
    'Veg Main Course',
    'Non-Veg Main Course',
    'Rice',
    'Breads',
    'Desserts',
  ];

  useEffect(() => {
    const params = new URLSearchParams(urlSearch);
    const cat = params.get('category');
    if (cat) setCategory(cat);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Backend route is /api/menu (from menu_routes.py: prefix="/menu")
      const res = await api.get('/menu');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = category === 'All' || item.category === category;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const isAvailable = item.availability !== false;
    return matchesCategory && matchesSearch && isAvailable;
  });

  const accent = '#C0754A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1rem',
        paddingBottom: '2rem', borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(192,117,74,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChefHat size={24} color={accent} />
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: 'var(--text-primary)', margin: 0 }}>
                The Catalogue
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, fontStyle: 'italic', letterSpacing: '0.02em' }}>
              Curated heritage dishes, prepared with passion and precision.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '0 1 380px' }}>
            <Search size={18} color={accent} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '3rem', paddingRight: search ? '3rem' : '1.25rem', width: '100%' }}
              placeholder="Search our menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  background: isActive ? accent : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  boxShadow: isActive ? `0 4px 12px rgba(192,117,74,0.3)` : 'none',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'dish' : 'dishes'}
          {category !== 'All' && <> in <strong style={{ color: accent }}>{category}</strong></>}
          {search && <> matching "<strong style={{ color: 'var(--text-primary)' }}>{search}</strong>"</>}
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '1.75rem' }} />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {filteredItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '5rem 2rem', gap: '1.5rem', textAlign: 'center',
          background: 'var(--bg-secondary)', borderRadius: '2rem', border: '1px solid var(--border)'
        }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(192,117,74,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UtensilsCrossed size={36} color={accent} strokeWidth={1.5} />
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>Nothing Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Try clearing your filters or searching for something else.</p>
          </div>
          <button
            onClick={() => { setSearch(''); setCategory('All'); }}
            className="btn-outline"
            style={{ padding: '0.75rem 1.75rem' }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
