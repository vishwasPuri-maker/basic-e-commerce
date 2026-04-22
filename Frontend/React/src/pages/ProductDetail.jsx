import { useState, useEffect, useMemo } from 'react'; // useMemo add kiya
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { placeOrder } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const generateReviews = (productId) => {
  const reviewPool = [
    { name: 'Arjun S.', rating: 5, comment: 'Absolutely worth every penny.', date: 'March 2026' },
    { name: 'Priya M.', rating: 4, comment: 'Great product, fast delivery.', date: 'February 2026' },
    { name: 'Rahul K.', rating: 5, comment: 'Exceeded my expectations.', date: 'March 2026' },
    { name: 'Sneha T.', rating: 4, comment: 'Very good quality.', date: 'January 2026' },
    { name: 'Vikram P.', rating: 5, comment: 'Best purchase I have made this year.', date: 'April 2026' },
  ];
  const start = (productId * 3) % reviewPool.length;
  return [0, 1, 2, 3].map(i => reviewPool[(start + i) % reviewPool.length]);
};

const StarRating = ({ rating, size = 16 }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(star => (
      <span key={star} style={{ color: star <= rating ? '#aa3000' : '#e6beb2', fontSize: `${size}px` }}>★</span>
    ))}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', pincode: ''
  });

  // 1. Optimized Animation Logic
  useEffect(() => {
    if (!loading && product) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('in-view');
              observer.unobserve(e.target); // Ek baar dikhne ke baad observe karna band (Performance++)
            }
          });
        },
        { threshold: 0.1 }
      );

      // Sirf render hone ke baad query karein
      const elements = document.querySelectorAll('.reveal, .img-reveal');
      elements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    }
  }, [loading, product]);

  // 2. Optimized Data Fetching
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 3. Performance Fix: Reviews ko memoize kiya (Typing ke waqt lag nahi aayega)
  const reviews = useMemo(() => {
    return product ? generateReviews(product.id) : [];
  }, [product]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setOrderLoading(true);
    const { ok } = await placeOrder(user.id, product.id, token);
    if (ok) { setOrderPlaced(true); setShowAddressForm(false); }
    setOrderLoading(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fcf9f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{
            width: '48px', height: '48px', border: '3px solid #e6beb2',
            borderTopColor: '#aa3000', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Product not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#fcf9f8' }}>
      <Navbar />

      <div style={{ paddingTop: '88px', maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 0' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
          color: '#916f65', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          ← Back to Shop
        </button>
      </div>

      <section style={{
        maxWidth: '1280px', margin: '0 auto', padding: '32px 32px 64px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start'
      }}>
        {/* Left — Image */}
        <div className="reveal">
          <div style={{
            borderRadius: '24px', overflow: 'hidden',
            position: 'relative', background: '#f0eded'
          }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
              onError={e => { e.target.src = 'https://placehold.co/600x400/f0eded/916f65?text=No+Image'; }}
            />
            <div style={{
              position: 'absolute', top: '16px', left: '16px',
              background: '#aa3000', color: '#ffffff',
              padding: '6px 16px', borderRadius: '999px',
              fontFamily: 'Inter', fontSize: '11px', fontWeight: 600
            }}>
              In Stock ✓
            </div>
          </div>
        </div>

        {/* Right — Details */}
        <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <span style={{
            fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
            color: '#aa3000', letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            {product.category?.name}
          </span>

          <h1 style={{
            fontFamily: 'Manrope', fontSize: '44px', fontWeight: 900,
            letterSpacing: '-0.03em', color: '#1c1b1b', lineHeight: '1.1'
          }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StarRating rating={Math.round(avgRating)} size={20} />
            <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#916f65' }}>
              {avgRating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>

          <div style={{
            fontFamily: 'Manrope', fontSize: '48px', fontWeight: 900,
            color: '#1c1b1b', letterSpacing: '-0.03em'
          }}>
            ${product.price}
          </div>

          <p style={{
            fontFamily: 'Inter', fontSize: '15px', color: '#5d5f5f',
            lineHeight: '1.7', borderLeft: '3px solid #e6beb2', paddingLeft: '16px'
          }}>
            {product.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Category', value: product.category?.name },
              { label: 'Product ID', value: `#${product.id}` },
              { label: 'Availability', value: 'In Stock' },
              { label: 'Delivery', value: '3-5 Business Days' }
            ].map(spec => (
              <div key={spec.label} style={{
                background: '#f6f3f2', borderRadius: '12px',
                padding: '16px', border: '1px solid #e6beb2'
              }}>
                <div style={{
                  fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                  color: '#916f65', textTransform: 'uppercase',
                  letterSpacing: '0.08em', marginBottom: '6px'
                }}>
                  {spec.label}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, color: '#1c1b1b' }}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          {orderPlaced ? (
            <div style={{
              background: '#d4edda', borderRadius: '16px',
              padding: '20px', textAlign: 'center',
              fontFamily: 'Inter', fontSize: '15px',
              fontWeight: 700, color: '#155724',
              border: '1px solid #c3e6cb'
            }}>
              ✓ Order Placed Successfully!
            </div>
          ) : (
            <button
              className="btn-tertiary"
              onClick={() => user ? setShowAddressForm(true) : navigate('/login')}
              style={{ width: '100%', padding: '18px', fontSize: '15px' }}
            >
              {user ? 'Buy Now →' : 'Login to Order →'}
            </button>
          )}
        </div>
      </section>

      {/* Address Modal */}
      {showAddressForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(28,27,27,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '24px',
            padding: '48px', width: '100%', maxWidth: '520px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.2)'
          }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontFamily: 'Manrope', fontSize: '28px',
                fontWeight: 900, color: '#1c1b1b', letterSpacing: '-0.03em'
              }}>
                Delivery Address
              </h2>
              <button onClick={() => setShowAddressForm(false)} style={{
                background: '#f0eded', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer',
                fontSize: '16px', color: '#5d5f5f'
              }}>✕</button>
            </div>

            <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['fullName', 'phone', 'street', 'city', 'state', 'pincode'].map(key => (
                <div key={key}>
                  <label className="input-label" style={{textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    className="input-field"
                    type="text"
                    value={address[key]}
                    onChange={e => setAddress({ ...address, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="btn-tertiary"
                disabled={orderLoading}
                style={{ width: '100%', padding: '16px', fontSize: '15px' }}
              >
                {orderLoading ? 'Placing Order...' : 'Confirm Order →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reviews */}
      <section style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '64px 32px', borderTop: '1px solid #e6beb2'
      }}>
        <div className="reveal" style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: 'Manrope', fontSize: '36px', fontWeight: 900,
            letterSpacing: '-0.03em', color: '#1c1b1b', marginBottom: '8px'
          }}>
            Customer Reviews
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StarRating rating={Math.round(avgRating)} size={20} />
            <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#916f65' }}>
              {avgRating.toFixed(1)} average from {reviews.length} verified reviews
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {reviews.map((review, index) => (
            <div key={index} className="reveal" style={{
              background: '#ffffff', borderRadius: '16px',
              border: '1px solid #e6beb2', padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontFamily: 'Inter', fontSize: '14px', fontWeight: 700, color: '#1c1b1b', marginBottom: '2px' }}>
                    {review.name}
                  </p>
                  <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#916f65' }}>
                    Verified Buyer · {review.date}
                  </p>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>
              <p style={{
                fontFamily: 'Inter', fontSize: '14px',
                color: '#5d5f5f', lineHeight: '1.6', fontStyle: 'italic'
              }}>
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{
        borderTop: '1px solid #e6beb2', background: '#1c1b1b',
        padding: '48px 32px', marginTop: '80px'
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontFamily: 'Manrope', fontSize: '20px', fontWeight: 900, color: '#ffffff' }}>
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

export default ProductDetail;
