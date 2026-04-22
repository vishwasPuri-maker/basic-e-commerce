import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { ok, data } = await loginUser(username, password);
        if (ok) {
          login({ username, id: 1 }, data.token);
          navigate('/');
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        const response = await registerUser(username, password);
        if (response.ok) {
          setIsLogin(true);
          setError('');
          alert('Registered! Please login.');
        } else {
          setError('Username already exists.');
        }
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>

      {/* Left — Image */}
      <div style={{
        width: '55%', position: 'relative',
        overflow: 'hidden', display: 'flex',
        alignItems: 'flex-end', padding: '48px'
      }}>
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=85"
          alt="store"
          style={{
            position: 'absolute', inset: 0, width: '100%',
            height: '100%', objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(28,27,27,0.85) 0%, rgba(28,27,27,0.2) 60%)'
        }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            fontFamily: 'Manrope', fontSize: '24px', fontWeight: 900,
            color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.04em'
          }}>
            SHOPIFY
          </div>
          <h1 style={{
            fontFamily: 'Manrope', fontSize: '56px', fontWeight: 900,
            color: '#ffffff', lineHeight: '1', letterSpacing: '-0.04em',
            marginBottom: '16px'
          }}>
            Shop the<br />
            <span style={{ color: '#ffb59e' }}>best</span><br />
            products.
          </h1>
          <p style={{
            fontFamily: 'Inter', fontSize: '16px', color: 'rgba(255,255,255,0.6)',
            borderLeft: '3px solid #aa3000', paddingLeft: '16px', lineHeight: '1.6'
          }}>
            70+ premium products across 7 categories.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        width: '45%', background: '#fcf9f8',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '48px 64px'
      }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>

          {/* Toggle */}
          <div style={{
            display: 'flex', gap: '4px', background: '#f0eded',
            borderRadius: '999px', padding: '4px', marginBottom: '48px',
            width: 'fit-content'
          }}>
            {['Login', 'Register'].map(tab => (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === 'Login'); setError(''); }}
                style={{
                  background: (isLogin ? tab === 'Login' : tab === 'Register') ? '#ffffff' : 'transparent',
                  color: (isLogin ? tab === 'Login' : tab === 'Register') ? '#1c1b1b' : '#5d5f5f',
                  border: 'none', borderRadius: '999px',
                  padding: '10px 28px', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.2s',
                  boxShadow: (isLogin ? tab === 'Login' : tab === 'Register')
                    ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: 'Manrope', fontSize: '40px', fontWeight: 900,
              color: '#1c1b1b', letterSpacing: '-0.03em', marginBottom: '8px'
            }}>
              {isLogin ? 'Welcome back!' : 'Join us today!'}
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '15px', color: '#916f65' }}>
              {isLogin ? 'Enter your credentials to continue.' : 'Create your account to get started.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label className="input-label">Username</label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{
                background: '#ffdad6', borderRadius: '12px',
                padding: '12px 16px', fontFamily: 'Inter',
                fontSize: '13px', color: '#ba1a1a'
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '16px', fontSize: '15px' }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login →' : 'Create Account →')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
