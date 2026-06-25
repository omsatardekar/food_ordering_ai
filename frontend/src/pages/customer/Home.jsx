import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChefHat, Sparkles, Star, Clock, Shield, Leaf, Package } from 'lucide-react';
import AISearchBar from '../../components/customer/AISearchBar';
import axios from '../../services/api';

import heroImg from '../../assets/images/hero.png';
import startersImg from '../../assets/images/starters.png';
import mainsImg from '../../assets/images/mains.png';
import dessertsImg from '../../assets/images/desserts.png';

const Home = () => {
  const navigate = useNavigate();
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const res = await axios.get('/orders/my-orders');
        const orders = res.data;
        // Find an order that is not delivered or cancelled
        const active = orders.find(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
        if (active) {
          setActiveOrder(active);
        }
      } catch (err) {
        // user might not be logged in, ignore
      }
    };
    fetchActiveOrders();
  }, []);

  const collections = [
    { title: 'Gourmet Starters', desc: 'Delicate bites to awaken your palate.', image: startersImg, link: '/menu?category=Veg Starters', count: '10 items' },
    { title: 'Signature Mains', desc: 'Heritage recipes cooked to perfection.', image: mainsImg, link: '/menu?category=Veg Main Course', count: '10 items' },
    { title: 'Divine Desserts', desc: 'Sweet masterpieces to finish your meal.', image: dessertsImg, link: '/menu?category=Desserts', count: '3 items' },
  ];

  const features = [
    { icon: ChefHat, title: 'Expert Chefs', desc: 'Our chefs bring years of experience cooking authentic Indian recipes.' },
    { icon: Clock, title: 'Fast Delivery', desc: 'Hot meals at your door in 30–45 minutes.' },
    { icon: Shield, title: 'Hygienic & Safe', desc: 'We follow strict cleanliness and food safety standards.' },
    { icon: Leaf, title: 'Fresh Ingredients', desc: '100% natural ingredients sourced locally every day.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', paddingBottom: '4rem', animation: 'fadeUp 0.7s ease forwards' }}>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', borderRadius: '3rem', overflow: 'hidden', height: '680px' }}>
        <img
          src={heroImg}
          alt="Heritage dining"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: 'slowZoom 4s ease forwards' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,10,5,0.88) 0%, rgba(26,10,5,0.45) 50%, rgba(0,0,0,0.1) 100%)' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.2rem', background: 'rgba(192,117,74,0.25)', border: '1px solid rgba(192,117,74,0.4)', borderRadius: '99px' }}>
            <Sparkles size={15} color="#C0754A" />
            <span style={{ color: '#C0754A', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Heritage Restaurant</span>
          </div>

          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, color: 'white', lineHeight: 1.05, margin: 0 }}>
              The Art of <span style={{ color: '#C0754A', fontStyle: 'italic' }}>Fine Cuisine</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginTop: '1rem', maxWidth: '560px', lineHeight: 1.7 }}>
              Fresh ingredients, authentic recipes, delivered hot to your door. Order in minutes.
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '640px' }}>
            <AISearchBar />
          </div>

          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '0.5rem' }}>
            {[['4.9 ★', 'Customer Rating'], ['30+', 'Heritage Dishes'], ['45 min', 'Avg. Delivery']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", color: '#C0754A', fontSize: '1.3rem', fontWeight: 700 }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{lbl}</div>
              </div>
            ))}
          </div>

          {activeOrder && (
            <div 
              onClick={() => navigate(`/track-order/${activeOrder.id}`)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem 2rem', borderRadius: '1rem', border: '1px solid var(--accent)', marginTop: '2rem', boxShadow: '0 10px 30px rgba(192, 117, 74, 0.2)' }}
            >
              <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Package size={20} color="var(--accent)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                 <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>Track Your Active Order</h4>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{activeOrder.status}</span></p>
              </div>
              <ArrowRight size={20} color="var(--accent)" style={{ marginLeft: '1rem' }} />
            </div>
          )}
        </div>
      </section>

      {/* ── Collections ── */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#C0754A', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Our Curation</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--text-primary)', margin: 0 }}>What's on the Menu</h2>
          <div style={{ width: '60px', height: '3px', background: 'linear-gradient(to right, #C0754A, #E8966A)', borderRadius: '99px', margin: '1.25rem auto 0' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {collections.map((col, i) => (
            <div
              key={i}
              onClick={() => navigate(col.link)}
              className="card"
              style={{ cursor: 'pointer', height: '520px', position: 'relative', overflow: 'hidden', borderRadius: '2rem' }}
            >
              <img
                src={col.image}
                alt={col.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.5s ease' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,10,5,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', color: 'white' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{col.count}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', margin: '0 0 0.5rem' }}>{col.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 1rem', lineHeight: 1.5 }}>{col.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>Explore</span>
                  <div style={{ width: '28px', height: '28px', background: '#C0754A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{
        background: 'var(--bg-secondary)',
        borderRadius: '3rem',
        padding: '4rem 3rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#C0754A', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Why Choose Us</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--text-primary)', margin: 0 }}>Why Choose Us</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '2rem 1.75rem',
                background: 'var(--bg-card)',
                borderRadius: '1.75rem',
                border: '1px solid var(--border)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ width: '52px', height: '52px', background: 'rgba(192,117,74,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <f.icon size={26} color="#C0754A" />
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>{f.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes slowZoom { from { transform: scale(1.06); } to { transform: scale(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Home;
