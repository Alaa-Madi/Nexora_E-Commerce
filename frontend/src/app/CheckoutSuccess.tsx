import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useCart from "../store/useCart";
import useAuth from "../store/useAuth";
import { api } from "../lib/api";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart, items, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [orderCreated, setOrderCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryCount, setSummaryCount] = useState<number | null>(null);
  const [summaryTotal, setSummaryTotal] = useState<string | null>(null);
  const [savedOrder, setSavedOrder] = useState<any | null>(null);
  const total = useMemo(() => Number(getTotalPrice()).toFixed(2), [getTotalPrice]);

  useEffect(() => {
    const createOrder = async () => {
      if (!sessionId || !user?.id || orderCreated) return;

      try {
        setIsSubmitting(true);
        // snapshot cart details BEFORE API and before clearing the cart
        const countSnapshot = items.reduce((acc, it) => acc + Number(it.quantity || 1), 0);
        const totalSnapshot = Number(getTotalPrice()).toFixed(2);
        setSummaryCount(countSnapshot);
        setSummaryTotal(totalSnapshot);
        const response = await api.createOrder({
          sessionId,
          userId: user.id,
          items: items.map(item => ({
            title: item.title,
            image: item.image,
            price: item.price,
            quantity: item.quantity
          })),
          total: getTotalPrice()
        });
        const orderFromApi = (response && response.order) ? response.order : null;
        if (orderFromApi) {
          setSavedOrder(orderFromApi);
          // Prefer authoritative totals from backend
          const apiCount = Array.isArray(orderFromApi.items) ? orderFromApi.items.reduce((a: number, it: any) => a + Number(it.quantity || 1), 0) : countSnapshot;
          const apiTotal = (orderFromApi.total != null) ? Number(orderFromApi.total).toFixed(2) : totalSnapshot;
          setSummaryCount(apiCount);
          setSummaryTotal(apiTotal);
        }
        
        setOrderCreated(true);
        clearCart();
      } catch (err: any) {
        console.error('Error creating order:', err);
        setError(err.message || 'Failed to create order');
      } finally {
        setIsSubmitting(false);
      }
    };

    createOrder();
  }, [sessionId, user?.id, items, getTotalPrice, clearCart, orderCreated]);

  return (
    <main className="w-full mx-auto px-4 py-8">
      <Header />
      <section style={{
        background: '#102040',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 2px 12px #1769FA44',
        color: '#F9FAFB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 9999, background: '#10B981', color: '#ffffff', fontWeight: 800
          }}>✓</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>Payment Successful</h1>
        </div>
        {user?.name && (
          <p style={{ color: '#A3AAB8', marginTop: 0, marginBottom: '1rem' }}>Thank you, <span style={{ color: '#F9FAFB', fontWeight: 700 }}>{user.name}</span>! Your payment has been processed.</p>
        )}
        {error ? (
          <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
            <p>Payment successful, but there was an issue saving your order:</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error}</p>
          </div>
        ) : orderCreated ? (
          <div style={{
            background: '#0F1B3D', border: '1px solid #1F2A44', borderRadius: '1rem', padding: '1rem', marginTop: '0.75rem'
          }}>
            <p style={{ color: '#10B981', fontWeight: 700, marginBottom: '0.25rem' }}>Your order is confirmed!</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3AAB8' }}>
              <span>Items</span>
              <span>{summaryCount ?? items.reduce((acc, it) => acc + Number(it.quantity || 1), 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3AAB8' }}>
              <span>Total</span>
              <span style={{ color: '#F9FAFB', fontWeight: 700 }}>${summaryTotal ?? total}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A3AAB8' }}>
            <span style={{
              width: 18, height: 18, border: '2px solid #2E3A63', borderTopColor: '#1769FA', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite'
            }} />
            <p style={{ margin: 0 }}>Processing your order...</p>
          </div>
        )}
        {sessionId && (
          <p style={{ color: '#A3AAB8', fontSize: '0.9rem', marginTop: '1rem' }}>
            Reference: <span style={{ color: '#F9FAFB' }}>{sessionId}</span>
          </p>
        )}
        <div style={{ marginTop: '1.5rem' }}>
          <Link 
            to="/orders" 
            style={{ 
              fontWeight: 700, 
              textDecoration: 'none',
              background: '#1769FA',
              color: '#fff',
              padding: '0.8rem 1.5rem',
              borderRadius: '0.5rem',
              display: 'inline-block'
            }}
          >
            View Your Orders
          </Link>
          <a
            href="/products"
            style={{ 
              marginLeft: '0.75rem',
              color: '#0F1B3D', 
              fontWeight: 700, 
              textDecoration: 'none',
              background: '#F9FAFB',
              padding: '0.8rem 1.5rem',
              borderRadius: '0.5rem',
              display: 'inline-block'
            }}
          >
            Continue Shopping
          </a>
          {isSubmitting && (
            <span style={{ marginLeft: '0.75rem', color: '#A3AAB8', fontSize: '0.9rem' }}>Saving your order...</span>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}


