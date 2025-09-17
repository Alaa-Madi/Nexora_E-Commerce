import Header from "../components/navbar/Header";
import UseAnimationFrameCube from "../components/shapes/shape1";
import HeroSection from "../components/landing/HeroSection";
import CategorySection from "../components/landing/CategorySection";
import FeaturedProductsSection from "../components/landing/FeaturedProductsSection";
import PromoBannerSection from "../components/landing/PromoBannerSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/Footer";
import useAuth from "../store/useAuth";
import { Link } from "react-router-dom";

export default function Home() {
  const { isAuthenticated, user, role } = useAuth();

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        <Header />
        
        {/* Welcome Message for Authenticated Users */}
        {isAuthenticated && (
          <div style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '1rem',
            padding: '1.5rem',
            margin: '1rem 0 2rem 0',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Welcome back, {user?.name || 'User'}! 👋
            </h2>
            <p style={{
              color: '#D1FAE5',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}>
              {role === 'admin' 
                ? 'You have admin access to manage the store' 
                : 'Ready to explore our amazing products?'
              }
            </p>
            {role === 'admin' && (
              <Link 
                to="/admin"
                style={{
                  background: '#fff',
                  color: '#059669',
                  fontWeight: 700,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  display: 'inline-block',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                Go to Admin Dashboard
              </Link>
            )}
            {role === 'user' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  to="/products"
                  style={{
                    background: '#fff',
                    color: '#059669',
                    fontWeight: 700,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Browse Products
                </Link>
                <Link 
                  to="/cart"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    border: '2px solid #fff'
                  }}
                >
                  View Cart
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Login Prompt for Guest Users */}
        {!isAuthenticated && (
          <div style={{
            background: 'linear-gradient(135deg, #1769FA 0%, #2563EB 100%)',
            borderRadius: '1rem',
            padding: '1.5rem',
            margin: '1rem 0 2rem 0',
            boxShadow: '0 4px 16px rgba(23, 105, 250, 0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Join Nexora Today! 🚀
            </h2>
            <p style={{
              color: '#DBEAFE',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}>
              Sign in to access exclusive features, manage your cart, and track your orders
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/login"
                style={{
                  background: '#fff',
                  color: '#1769FA',
                  fontWeight: 700,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                Login
              </Link>
              <Link 
                to="/register"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  border: '2px solid #fff'
                }}
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        <HeroSection />
        <div className="w-full flex gap-8 justify-center items-center mb-8">
          <UseAnimationFrameCube size={100} animationConfig={{ initialRotate: 0 }} />
          <UseAnimationFrameCube size={120} animationConfig={{ initialRotate: 45, rotateSpeed: 8000, yAmount: 30 }} />
          <UseAnimationFrameCube size={80} animationConfig={{ initialRotate: 90, rotateSpeed: 5000, yAmount: 10 }} />
        </div>
        <CategorySection />
        <FeaturedProductsSection />
        <PromoBannerSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </>
  );
}