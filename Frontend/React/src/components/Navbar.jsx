import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      background: 'rgba(252,249,248,0.75)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #e6beb2', height: '68px',
      display: 'flex', alignItems: 'center'
    }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 32px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'Manrope', fontSize: '22px', fontWeight: 900,
          color: '#1c1b1b', textDecoration: 'none', letterSpacing: '-0.04em'
        }}>
          SHOPIFY
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Shop', 'My Orders'].map((item) => (
            <Link
              key={item}
              to={item === 'Shop' ? '/' : '/orders'}
              style={{
                fontFamily: 'Manrope', fontSize: '14px', fontWeight: 600,
                color: '#5d5f5f', textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.target.style.color = '#1c1b1b'}
              onMouseLeave={e => e.target.style.color = '#5d5f5f'}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Search + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#f0eded', borderRadius: '999px',
            padding: '8px 16px', border: '1px solid #e6beb2'
          }}>
            <span style={{ fontSize: '16px', color: '#916f65' }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => onSearch && onSearch(e.target.value)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#1c1b1b', fontFamily: 'Inter', fontSize: '13px',
                width: '160px'
              }}
            />
          </div>

          {/* Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: 'Inter', fontSize: '13px', fontWeight: 600,
                color: '#aa3000'
              }}>
                👋 {user.username}
              </span>
              <button onClick={handleLogout} className="btn-secondary"
                style={{ padding: '8px 20px', fontSize: '13px' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login">
                <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  Login
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
