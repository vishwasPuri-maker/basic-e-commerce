import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersByUser } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const MyOrders = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Optimized Animation Logic (Sabse badi problem yahi fix ki hai)
  useEffect(() => {
    if (!loading && orders.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in-view');
              observer.unobserve(e.target); // Element animate hone ke baad observation rok do
            }
          });
        },
        { threshold: 0.05 }
      );

      // Sirf relevant elements ko observe karein
      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, [loading, orders]);

  // 2. Data Fetching with Error Handling
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUser(user.id, token);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Orders load karne mein error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  // 3. Performance Fix: Calculation ko memoize kiya taaki typing ya hover par lag na aaye
  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.product?.price || 0), 0);
  }, [orders]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PLACED': return { bg: '#fff3cd', color: '#856404', border: '#ffc107' };
      case 'SHIPPED': return { bg: '#cce5ff', color: '#004085', border: '#b8daff' };
      case 'DELIVERED': return { bg: '#d4edda', color: '#155724', border: '#c3e6cb' };
      case 'CANCELLED': return { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' };
      default: return { bg: '#f0eded', color: '#5d5f5f', border: '#e6beb2' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fcf9f8' }}>
      <Navbar />

      {/* Header Section */}
      <section style={{
        paddingTop: '68px', background: '#ffffff',
        borderBottom: '1px solid #e6beb2'
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '64px 32px 48px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
        }}>
          <div>
            <span style={{
              fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
              color: '#aa3000', letterSpacing: '0.1em',
              textTransform: 'uppercase', display: 'block', marginBottom: '12px'
            }}>
              Account Overview
            </span>
            <h1 style={{
              fontFamily: 'Manrope', fontSize: '64px', fontWeight: 900,
              letterSpacing: '-0.04em', color: '#1c1b1b', lineHeight: '1'
            }}>
              My Orders
            </h1>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              background: '#f6f3f2', borderRadius: '16px',
              padding: '20px 32px', border: '1px solid #e6beb2'
            }}>
              <span style={{
                fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                color: '#916f65', textTransform: 'uppercase',
                letterSpacing: '0.08em', display: 'block', marginBottom: '8px'
              }}>
                Total Orders
              </span>
              <span style={{
                fontFamily: 'Manrope', fontSize: '36px',
                fontWeight: 900, color: '#1c1b1b'
              }}>
                {orders.length}
              </span>
            </div>
            <div style={{
              background: '#f6f3f2', borderRadius: '16px',
              padding: '20px 32px',
              border: '2px solid #aa3000'
            }}>
              <span style={{
                fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                color: '#916f65', textTransform: 'uppercase',
                letterSpacing: '0.08em', display: 'block', marginBottom: '8px'
              }}>
                Total Spent
              </span>
              <span style={{
                fontFamily: 'Manrope', fontSize: '36px',
                fontWeight: 900, color: '#aa3000'
              }}>
                ${totalSpent.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List Section */}
      <section style={{
        maxWidth: '1280px', margin: '0 auto', padding: '48px 32px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{
              width: '48px', height: '48px', border: '3px solid #e6beb2',
              borderTopColor: '#aa3000', borderRadius: '50%',
              margin: '0 auto', animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '120px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛍️</div>
            <p style={{
              fontFamily: 'Manrope', fontSize: '28px', fontWeight: 900,
              color: '#1c1b1b', marginBottom: '12px', letterSpacing: '-0.03em'
            }}>
              No orders yet
            </p>
            <p style={{
              fontFamily: 'Inter', fontSize: '15px',
              color: '#916f65', marginBottom: '40px'
            }}>
              Your order history will appear here.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{ 
                padding: '16px 48px', fontSize: '15px', background: '#1c1b1b', 
                color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' 
              }}
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order, index) => {
              const statusStyle = getStatusStyle(order.status);
              return (
                <div
                  key={order.id}
                  className="reveal"
                  style={{
                    background: '#ffffff', borderRadius: '20px',
                    border: '1px solid #e6beb2', padding: '28px',
                    display: 'grid', gridTemplateColumns: '96px 1fr auto',
                    gap: '28px', alignItems: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={order.product?.imageUrl}
                    alt={order.product?.name}
                    style={{
                      width: '96px', height: '96px',
                      objectFit: 'cover', borderRadius: '12px',
                      background: '#f0eded'
                    }}
                    onError={e => { e.target.src = 'https://placehold.co/96x96/f0eded/916f65?text=IMG'; }}
                  />

                  {/* Order Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{
                        fontFamily: 'Inter', fontSize: '11px',
                        fontWeight: 600, color: '#916f65'
                      }}>
                        Order #{order.id}
                      </span>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                        padding: '3px 12px', borderRadius: '999px',
                        fontFamily: 'Inter', fontSize: '11px', fontWeight: 600
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <h3 style={{
                      fontFamily: 'Manrope', fontSize: '20px', fontWeight: 800,
                      color: '#1c1b1b', marginBottom: '8px', letterSpacing: '-0.02em'
                    }}>
                      {order.product?.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#916f65' }}>
                        📦 {order.product?.category?.name || 'Category'}
                      </span>
                      <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#916f65' }}>
                        📅 {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'Manrope', fontSize: '32px',
                      fontWeight: 900, color: '#1c1b1b', letterSpacing: '-0.03em'
                    }}>
                      ${order.product?.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
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

export default MyOrders;
