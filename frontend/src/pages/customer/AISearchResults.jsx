import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Sparkles, 
  ArrowLeft, 
  Search, 
  ChefHat, 
  ShieldCheck, 
  Flame, 
  Leaf, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AISearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const query = new URLSearchParams(location.search).get('q');

    const fetchAIResults = async () => {
        setLoading(true);
        try {
            const response = await api.post('/ai-search', { query });
            setResults(response.data);
        } catch (error) {
            toast.error("AI couldn't process your request");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (query) {
            fetchAIResults();
        } else {
            navigate('/');
        }
    }, [query]);

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: '-20px', background: 'var(--accent)', filter: 'blur(30px)', opacity: 0.15, borderRadius: '50%' }}></div>
                    <Sparkles className="animate-pulse" size={64} color="var(--accent)" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Analyzing Flavors</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Our AI is finding the perfect matches for your request...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '5rem', animation: 'fadeIn 0.5s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <button 
                    onClick={() => navigate('/')}
                    style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                >
                    <ArrowLeft size={16} /> Back to Home
                </button>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Sparkles size={28} color="var(--accent)" />
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', margin: 0 }}>AI Recommendations</h1>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontStyle: 'italic' }}>
                            " {query} "
                        </p>
                    </div>

                    <div style={{ padding: '1rem 2rem', background: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px solid var(--border)', display: 'flex', gap: '3rem' }}>
                        <div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Confidence</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>98%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Matches</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{results?.count} found</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Intent Analysis Badge */}
            <div style={{ padding: '1.5rem 2rem', background: '#FDF8F4', borderRadius: '2rem', border: '1px solid #E8DDD4', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={24} color="var(--accent)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2D2318', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identified Intent</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {results?.intent?.vegetarian && <span style={{ padding: '0.4rem 1rem', background: 'white', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>Vegetarian</span>}
                    {results?.intent?.spicy && <span style={{ padding: '0.4rem 1rem', background: 'white', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>Spicy</span>}
                    {results?.intent?.category && <span style={{ padding: '0.4rem 1rem', background: 'white', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>{results.intent.category}</span>}
                    {results?.intent?.max_price && <span style={{ padding: '0.4rem 1rem', background: 'white', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>Under ₹{results.intent.max_price}</span>}
                </div>
            </div>

            {/* Results Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {results?.results.map((item) => (
                    <div 
                        key={item.id} 
                        className="card"
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', borderRadius: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${item.id}`)}
                    >
                        {/* Score Badge */}
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.5rem 1rem', background: 'rgba(192,117,74,0.1)', borderRadius: '1rem', border: '1px solid rgba(192,117,74,0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem', zIndex: 1 }}>
                            <Sparkles size={14} color="var(--accent)" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)' }}>{item.score}% Match</span>
                        </div>

                        <div style={{ height: '200px', borderRadius: '1.75rem', overflow: 'hidden' }}>
                            <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{item.name}</h3>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>₹{item.price}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                        </div>

                        {/* Reasoning */}
                        <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <ChefHat size={12} /> Why it matched
                            </div>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2D2318', margin: 0 }}>{item.match_reason}</p>
                        </div>

                        <button className="btn-primary" style={{ marginTop: 'auto', borderRadius: '1.25rem', width: '100%', padding: '1rem' }}>
                            View Details <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {results?.results.length === 0 && (
                <div style={{ padding: '5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <Search size={64} color="var(--border)" />
                    <div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: 'var(--text-primary)' }}>No Taste Matches</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem auto' }}>We couldn't find exactly what you were looking for. Try a broader search like "light lunch" or "spicy".</p>
                    </div>
                    <button className="btn-outline" onClick={() => navigate('/')}>Back to Home</button>
                </div>
            )}
        </div>
    );
};

export default AISearchResults;
