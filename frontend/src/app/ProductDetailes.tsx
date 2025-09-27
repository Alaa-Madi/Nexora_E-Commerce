import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useCart from "../store/useCart";
import useFavorites from "../store/useFavorites";
import useAuth from "../store/useAuth";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItemWithAuth } = useCart();
  const { toggle, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/products`)
        .then((r) => r.json())
        .then((data) => {
          const products = Array.isArray(data) ? data : (data?.rows || []);
          const foundProduct = products.find((p: any) => p.id === parseInt(id));
          setProduct(foundProduct);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const success = addItemWithAuth({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.url || "http://localhost:5173/vite.svg",
      }, isAuthenticated);
      
      if (!success) {
        navigate('/unauthenticated', { state: { from: location.pathname } });
        return;
      }
      
      // If successful, add the remaining quantity
      for (let i = 1; i < quantity; i++) {
        addItemWithAuth({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0]?.url || "http://localhost:5173/vite.svg",
        }, isAuthenticated);
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggle({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url || "http://localhost:5173/vite.svg",
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center', color: '#F9FAFB' }}>
          <h1>Loading...</h1>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center', color: '#F9FAFB' }}>
          <h1>Product not found</h1>
          <button 
            onClick={() => navigate('/products')}
            style={{
              background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '1rem',
              padding: '0.7rem 1.5rem',
              border: 'none',
              boxShadow: '0 2px 8px #1769FA44',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Back to Products
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        <Header />
        
        {/* Hero Section */}
        <section
          style={{
            width: "100%",
            minHeight: "25vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0A1833 0%, #1769FA 100%)",
            color: "#F9FAFB",
            padding: "2rem",
            borderRadius: "2.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 32px 0 #1769FA33",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, Segoe UI, Arial, sans-serif"
          }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(120deg, #1769FA44 0%, #0A1833 80%)",
            zIndex: 0,
            borderRadius: "2.5rem"
          }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-block",
              background: "#102040",
              color: "#1769FA",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "1rem",
              padding: "0.4rem 1.2rem",
              marginBottom: "1.2rem",
              boxShadow: "0 2px 8px #1769FA22"
            }}>
              Product Details
            </span>
            <h1 style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              marginBottom: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-2px"
            }}>
              {product?.title || "Loading..."}
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#A3AAB8", fontWeight: 500 }}>
              {product ? `$${product.price}` : "Loading product details..."}
            </p>
          </div>
        </section>

        {/* Product Details Content */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button 
              onClick={() => navigate('/products')}
              style={{
                background: '#23272F',
                color: '#fff',
                border: 'none',
                borderRadius: '0.8rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                marginBottom: '2rem'
              }}
            >
              ← Back to Products
            </button>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '3rem', 
            alignItems: 'start',
            background: '#102040',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 2px 24px #1769FA44'
          }}>
            {/* Product Images Gallery */}
            <div>
              {/* Main Image */}
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src={product.images?.[selectedImageIndex]?.url || "http://localhost:5173/vite.svg"} 
                  alt={product.title}
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    borderRadius: '1rem',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  overflowX: 'auto',
                  paddingBottom: '0.5rem'
                }}>
                  {product.images.map((image: any, index: number) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '0.5rem',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: selectedImageIndex === index ? '3px solid #1769FA' : '3px solid transparent',
                        opacity: selectedImageIndex === index ? 1 : 0.7,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                {product.title}
              </h1>
              
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1769FA', marginBottom: '1.5rem' }}>
                ${product.price}
              </div>

              {product.description && (
                <p style={{ 
                  fontSize: '1.1rem', 
                  lineHeight: '1.6', 
                  color: '#A3AAB8', 
                  marginBottom: '2rem' 
                }}>
                  {product.description}
                </p>
              )}

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ color: '#A3AAB8' }}>SKU:</span>
                  <span>{product.sku || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ color: '#A3AAB8' }}>Stock:</span>
                  <span>{product.stock}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ color: '#A3AAB8' }}>Category:</span>
                  <span>{product.Category?.name || 'N/A'}</span>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                <label style={{ color: '#A3AAB8' }}>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#16224a',
                    color: '#F9FAFB',
                    textAlign: 'center'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{
                    background: product.stock === 0 ? '#666' : 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '1rem',
                    padding: '1rem 2rem',
                    border: 'none',
                    boxShadow: '0 2px 12px #1769FA44',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    flex: 1
                  }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  style={{
                    background: isFavorite(product.id) ? '#ef3b58' : '#16224a',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '1rem',
                    padding: '0 1.25rem',
                    border: 'none',
                    boxShadow: '0 2px 12px #1769FA44',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                  }}
                  title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label="toggle favorite"
                >
                  {isFavorite(product.id) ? '❤' : '♡'}
                </button>
              </div>
            </div>
          </div>
          </div> 
        </section>

        <Footer />
      </main>
    </>
  );
}
