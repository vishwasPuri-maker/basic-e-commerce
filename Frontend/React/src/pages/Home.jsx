import { useState, useEffect, useRef } from 'react';
import { getAllProducts, getProductsByCategory, searchProducts } from '../api/productApi';
import { getAllCategories } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';

// Hook: watch elements entering viewport
const useScrollReveal = (options = {}) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12, ...options }
    );
    const els = document.querySelectorAll('.reveal, .img-reveal, .slide-up, .slide-left, .slide-right, .scale-in');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
};

// Animated counter
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  useScrollReveal();

  // Parallax scroll tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleCategoryClick = async (categoryId) => {
    setLoading(true);
    setSelectedCategory(categoryId);
    const data = categoryId === null
      ? await getAllProducts()
      : await getProductsByCategory(categoryId);
    setProducts(data);
    setLoading(false);
  };

  const handleSearch = async (keyword) => {
    if (keyword.trim() === '') { fetchProducts(); return; }
    setLoading(true);
    const data = await searchProducts(keyword);
    setProducts(data);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fcf9f8', overflowX: 'hidden' }}>

      {/* Scroll animation styles */}
      <style>{`
        .slide-up {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                      transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .slide-up.in-view { opacity: 1; transform: translateY(0); }

        .slide-left {
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                      transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .slide-left.in-view { opacity: 1; transform: translateX(0); }

        .slide-right {
          opacity: 0;
          transform: translateX(48px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                      transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .slide-right.in-view { opacity: 1; transform: translateX(0); }

        .scale-in {
          opacity: 0;
          transform: scale(0.92);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1),
                      transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .scale-in.in-view { opacity: 1; transform: scale(1); }

        .img-reveal {
          filter: blur(16px) saturate(0.4);
          transform: scale(1.05);
          transition: filter 1.2s cubic-bezier(0.22,1,0.36,1),
                      transform 1.2s cubic-bezier(0.22,1,0.36,1);
        }
        .img-reveal.in-view { filter: blur(0px) saturate(1); transform: scale(1); }

        .d1 { transition-delay: 0.08s !important; }
        .d2 { transition-delay: 0.16s !important; }
        .d3 { transition-delay: 0.24s !important; }
        .d4 { transition-delay: 0.32s !important; }
        .d5 { transition-delay: 0.40s !important; }

        .category-pill {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .category-pill:hover {
          transform: translateY(-2px) scale(1.04);
        }

        .stat-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(170,48,0,0.12);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-badge {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <Navbar onSearch={handleSearch} />

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: '68px'
      }}>
        {/* Parallax background image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          transform: `translateY(${scrollY * 0.35}px)`,
          willChange: 'transform'
        }}>
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=85"
            alt="hero"
            style={{ width: '100%', height: '115%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(252,249,248,0.96) 38%, rgba(252,249,248,0.5) 70%, rgba(252,249,248,0.15) 100%)'
          }} />
        </div>

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%', zIndex: 1,
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,48,0,0.08) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.15}px)`
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '22%', zIndex: 1,
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,48,0,0.06) 0%, transparent 70%)',
          transform: `translateY(${scrollY * -0.1}px)`
        }} />

        <div style={{
          position: 'relative', zIndex: 10,
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 32px', width: '100%'
        }}>
          <div style={{ maxWidth: '620px' }}>

            {/* Floating badge */}
            <div className="hero-badge slide-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', border: '1.5px solid #e6beb2',
              borderRadius: '999px', padding: '8px 18px',
              marginBottom: '28px',
              boxShadow: '0 4px 20px rgba(170,48,0,0.1)'
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#aa3000', display: 'inline-block',
                boxShadow: '0 0 0 3px rgba(170,48,0,0.2)'
              }} />
              <span style={{
                fontFamily: 'Inter', fontSize: '12px',
                fontWeight: 600, color: '#aa3000', letterSpacing: '0.06em'
              }}>
                NEW SEASON COLLECTION
              </span>
            </div>

            {/* Headline */}
            <h1 className="slide-up d1" style={{
              fontFamily: 'Manrope', fontSize: 'clamp(56px, 7vw, 88px)',
              fontWeight: 900, lineHeight: '0.95',
              letterSpacing: '-0.04em', color: '#1c1b1b',
              marginBottom: '28px'
            }}>
              Shop the<br />
              <span style={{
                color: '#aa3000',
                background: 'linear-gradient(135deg, #aa3000, #e05a00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Best</span><br />
              Products.
            </h1>

            <p className="slide-up d2" style={{
              fontFamily: 'Inter', fontSize: '18px', color: '#5d5f5f',
              lineHeight: '1.7', marginBottom: '44px', maxWidth: '420px'
            }}>
              70+ premium products across 7 categories. Engineered for everyday life and performance.
            </p>

            <div className="slide-up d3" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                style={{ fontSize: '16px', padding: '16px 40px' }}
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Shop Now →
              </button>
              <button className="btn-secondary" style={{ fontSize: '16px', padding: '16px 40px' }}>
                Discover More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px'
        }}>
          <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#916f65', letterSpacing: '0.15em' }}>
            SCROLL
          </span>
          <div style={{
            width: '1px', height: '48px', background: 'linear-gradient(to bottom, #aa3000, transparent)',
            animation: 'float 2s ease-in-out infinite'
          }} />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{
        background: '#1c1b1b', padding: '40px 32px',
        borderTop: '1px solid #2e2d2d'
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px', textAlign: 'center'
        }}>
          {[
            { number: 70, suffix: '+', label: 'Products' },
            { number: 7, suffix: '', label: 'Categories' },
            { number: 500, suffix: '+', label: 'Happy Customers' },
            { number: 5, suffix: '★', label: 'Avg Rating' },
          ].map((stat, i) => (
            <div key={i} className={`stat-card scale-in d${i + 1}`} style={{
              padding: '24px', borderRadius: '16px',
              border: '1px solid #2e2d2d'
            }}>
              <div style={{
                fontFamily: 'Manrope', fontSize: '44px', fontWeight: 900,
                color: '#ffffff', letterSpacing: '-0.03em', lineHeight: '1'
              }}>
                <Counter target={stat.number} suffix={stat.suffix} />
              </div>
              <div style={{
                fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
                color: '#916f65', textTransform: 'uppercase',
                letterSpacing: '0.1em', marginTop: '8px'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORY FILTER ─── */}
      <section style={{
        background: '#ffffff', borderTop: '1px solid #e6beb2',
        borderBottom: '1px solid #e6beb2',
        position: 'sticky', top: '68px', zIndex: 40
      }}>
        <div
          className="no-scrollbar"
          style={{
            maxWidth: '1280px', margin: '0 auto',
            padding: '14px 32px', display: 'flex',
            gap: '8px', overflowX: 'auto'
          }}
        >
          {[{ id: null, name: 'All Products' }, ...categories].map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="category-pill"
              style={{
                background: selectedCategory === cat.id ? '#5d5c5b' : '#f0eded',
                color: selectedCategory === cat.id ? '#ffffff' : '#5d5f5f',
                border: 'none', borderRadius: '999px',
                padding: '10px 22px', cursor: 'pointer',
                fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: selectedCategory === cat.id ? '0 4px 16px rgba(0,0,0,0.18)' : 'none'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section id="products" style={{
        maxWidth: '1280px', margin: '0 auto', padding: '72px 32px'
      }}>

        {/* Section header */}
        <div className="slide-up" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', marginBottom: '48px',
          paddingBottom: '24px', borderBottom: '1px solid #e6beb2'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'Manrope', fontSize: '42px', fontWeight: 900,
              letterSpacing: '-0.03em', color: '#1c1b1b', marginBottom: '8px'
            }}>
              {selectedCategory === null
                ? 'All Products'
                : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#916f65' }}>
              {products.length} products available
            </p>
          </div>
          <div style={{
            fontFamily: 'Manrope', fontSize: '64px', fontWeight: 900,
            color: '#f0eded', letterSpacing: '-0.05em', lineHeight: '1',
            userSelect: 'none'
          }}>
            {String(products.length).padStart(2, '0')}
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{
              width: '48px', height: '48px', border: '3px solid #e6beb2',
              borderTopColor: '#aa3000', borderRadius: '50%',
              margin: '0 auto', animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p style={{
              fontFamily: 'Manrope', fontSize: '28px',
              fontWeight: 900, color: '#916f65'
            }}>
              No products found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`scale-in d${Math.min((index % 4) + 1, 5)}`}
                style={{ animationFillMode: 'both' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── MARQUEE BANNER ─── */}
      <section style={{
        background: '#aa3000', overflow: 'hidden',
        padding: '20px 0', borderTop: '1px solid #852400'
      }}>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex; gap: 0;
            animation: marquee 22s linear infinite;
            width: max-content;
          }
        `}</style>
        <div className="marquee-track">
          {[...Array(8)].map((_, i) => (
            <span key={i} style={{
              fontFamily: 'Manrope', fontSize: '13px', fontWeight: 700,
              color: '#ffffff', letterSpacing: '0.2em',
              textTransform: 'uppercase', padding: '0 40px',
              opacity: i % 2 === 0 ? 1 : 0.5
            }}>
              {i % 2 === 0 ? '✦ FREE DELIVERY OVER $50' : '✦ NEW ARRIVALS EVERY WEEK'}
            </span>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CATEGORIES ─── */}
      <section style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '96px 32px'
      }}>
        <div className="slide-up" style={{ marginBottom: '48px' }}>
          <span style={{
            fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
            color: '#aa3000', letterSpacing: '0.12em',
            textTransform: 'uppercase', display: 'block', marginBottom: '12px'
          }}>
            Browse by Category
          </span>
          <h2 style={{
            fontFamily: 'Manrope', fontSize: '42px', fontWeight: 900,
            letterSpacing: '-0.03em', color: '#1c1b1b'
          }}>
            Shop by Department
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {categories.slice(0, 4).map((cat, i) => (
            <div
              key={cat.id}
              className={`slide-up d${i + 1}`}
              onClick={() => {
                handleCategoryClick(cat.id);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: i === 0 ? '#1c1b1b' : '#f6f3f2',
                borderRadius: '20px', padding: '32px 24px',
                cursor: 'pointer', border: '1px solid #e6beb2',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontFamily: 'Manrope', fontSize: '48px', fontWeight: 900,
                color: i === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                position: 'absolute', bottom: '-8px', right: '16px',
                letterSpacing: '-0.05em', lineHeight: '1',
                userSelect: 'none'
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: i === 0 ? '#aa3000' : '#e6beb2',
                marginBottom: '20px'
              }} />
              <h3 style={{
                fontFamily: 'Manrope', fontSize: '18px', fontWeight: 800,
                color: i === 0 ? '#ffffff' : '#1c1b1b',
                letterSpacing: '-0.02em', marginBottom: '8px'
              }}>
                {cat.name}
              </h3>
              <span style={{
                fontFamily: 'Inter', fontSize: '12px',
                color: i === 0 ? '#916f65' : '#aa3000',
                fontWeight: 600
              }}>
                Shop Now →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid #e6beb2', background: '#1c1b1b',
        padding: '56px 32px'
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{
            fontFamily: 'Manrope', fontSize: '22px',
            fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em'
          }}>
            SHOPIFY
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#5d5f5f' }}>
            © 2026 Shopify Store. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
