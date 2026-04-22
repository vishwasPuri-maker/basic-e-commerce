import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #e6beb2',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = 'https://placehold.co/600x400/f0eded/916f65?text=No+Image'; }}
        />

        {/* Category Badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: '#aa3000', color: '#ffffff',
          padding: '4px 12px', borderRadius: '999px',
          fontFamily: 'Inter', fontSize: '10px', fontWeight: 600,
          letterSpacing: '0.05em'
        }}>
          {product.category?.name}
        </div>

        {/* Quick View */}
        <div
          className="cart-btn"
          style={{
            position: 'absolute', bottom: '12px', left: '50%',
            transform: 'translateX(-50%) translateY(16px)',
            background: '#1c1b1b', color: '#ffffff',
            padding: '8px 20px', borderRadius: '999px',
            fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
            whiteSpace: 'nowrap', opacity: 0,
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';
          }}
        >
          Quick View →
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <h4 style={{
          fontFamily: 'Manrope', fontSize: '14px', fontWeight: 700,
          color: '#1c1b1b', marginBottom: '4px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {product.name}
        </h4>
        <p style={{
          fontFamily: 'Inter', fontSize: '12px', color: '#916f65',
          marginBottom: '12px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {product.description?.substring(0, 45)}...
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'Manrope', fontWeight: 800,
            fontSize: '16px', color: '#1c1b1b'
          }}>
            ${product.price}
          </span>
          <span style={{
            background: '#f0eded', color: '#aa3000',
            padding: '4px 10px', borderRadius: '999px',
            fontFamily: 'Inter', fontSize: '11px', fontWeight: 600
          }}>
            In Stock
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
