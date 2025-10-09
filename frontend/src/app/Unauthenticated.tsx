import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Unauthenticated() {
  const location = useLocation();
  
  return (
    <>
      <main style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #0A1833 0%, #1769FA 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: '#102040',
          borderRadius: '2rem',
          padding: '3rem',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ fontSize: '6rem', fontWeight: 900, color: '#F59E0B', marginBottom: '1rem' }}>
            🔐
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: '#F9FAFB', 
            marginBottom: '1rem' 
          }}>
            Login Required
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#9CA3AF', 
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            You need to be logged in to access this feature. Please sign in to continue shopping and manage your cart.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/login"
              state={{ from: location.state?.from || '/' }}
              style={{
                background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '1rem',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Login
            </Link>
            <Link 
              to="/register"
              style={{
                background: '#16224a',
                color: '#F9FAFB',
                fontWeight: 700,
                borderRadius: '1rem',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontSize: '1.1rem',
                border: '2px solid #F59E0B',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create Account
            </Link>
            <Link 
              to="/"
              style={{
                background: '#16224a',
                color: '#F9FAFB',
                fontWeight: 700,
                borderRadius: '1rem',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontSize: '1.1rem',
                border: '2px solid #6B7280',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
