import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useCart from "../store/useCart";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Payment Successful</h1>
        <p style={{ color: '#A3AAB8' }}>Your order has been placed. Session: {sessionId}</p>
        <Link to="/orders" style={{ color: '#1769FA', fontWeight: 700 }}>View Orders</Link>
      </section>
      <Footer />
    </main>
  );
}


