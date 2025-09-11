import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";

export default function CheckoutCancel() {
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Payment Canceled</h1>
        <p style={{ color: '#A3AAB8' }}>Your payment was canceled. You can try again anytime.</p>
        <Link to="/cart" style={{ color: '#1769FA', fontWeight: 700 }}>Return to Cart</Link>
      </section>
      <Footer />
    </main>
  );
}


