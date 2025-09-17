import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/navbar/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
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
          boxShadow: '0 8px 32px rgba(23, 105, 250, 0.3)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ fontSize: '8rem', fontWeight: 900, color: '#1769FA', marginBottom: '1rem' }}>
            404
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            color: '#F9FAFB', 
            marginBottom: '1rem' 
          }}>
            Page Not Found
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#9CA3AF', 
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/"
              style={{
                background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '1rem',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 16px rgba(23, 105, 250, 0.4)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Go Home
            </Link>
            <Link 
              to="/products"
              style={{
                background: '#16224a',
                color: '#F9FAFB',
                fontWeight: 700,
                borderRadius: '1rem',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontSize: '1.1rem',
                border: '2px solid #1769FA',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
