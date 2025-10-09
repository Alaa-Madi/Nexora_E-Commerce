import React, { useState } from "react";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useCart from "../store/useCart";
import useAuth from "../store/useAuth";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    notes: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch("http://localhost:5000/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, title: i.title, price: i.price, image: i.image, quantity: i.quantity })),
          userId: user?.id,
          customer: formData,
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await response.json() : await response.text();
      if (!response.ok) {
        const message = (isJson && payload?.error) ? payload.error : (typeof payload === 'string' ? payload.slice(0, 300) : 'Failed to start checkout');
        throw new Error(message);
      }
      const data: any = payload;
      window.location.href = data.url; // redirect to Stripe Checkout
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert((err && err.message) ? err.message : "Checkout failed");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        <Header />
        
        {/* Hero Section */}
        <section
          style={{
            width: "100%",
            minHeight: "30vh",
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
              Secure Checkout
            </span>
            <h1 style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              marginBottom: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-2px"
            }}>
              Complete Your <span style={{ color: "#1769FA" }}>Order</span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#A3AAB8", fontWeight: 500 }}>
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} • ${getTotalPrice().toFixed(2)} total
            </p>
          </div>
        </section>

        {/* Checkout Content */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2rem',
          }}>
            {/* Billing/Shipping Form */}
            <form onSubmit={handleSubmit} style={{
              background: '#102040',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 2px 12px #1769FA44'
            }}>
              <h2 style={{ color: '#F9FAFB', marginBottom: '1rem' }}>Contact & Shipping</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} style={inputStyle} required />
                <input name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <input name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
              <input name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} style={inputStyle} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} style={inputStyle} required />
                <input name="zipCode" placeholder="ZIP / Postal code" value={formData.zipCode} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <textarea name="notes" placeholder="Order notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} style={{ ...inputStyle, minHeight: 100 }} />
              <button type="submit" disabled={items.length === 0 || isProcessing} style={payButtonStyle}>
                {isProcessing ? 'Redirecting…' : `Pay $${getTotalPrice().toFixed(2)} with Stripe`}
              </button>
            </form>

            {/* Order Summary */}
            <div style={{
              background: '#102040',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 2px 12px #1769FA44',
              height: 'fit-content'
            }}>
              <h3 style={{ color: '#F9FAFB', marginBottom: '1rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {items.map((i) => (
                  <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#F9FAFB' }}>
                    <img src={i.image} alt={i.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{i.title}</div>
                      <div style={{ color: '#A3AAB8', fontSize: 12 }}>Qty {i.quantity}</div>
                    </div>
                    <div style={{ color: '#A3AAB8' }}>${(i.price * i.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #1f2b52', marginTop: '0.8rem', paddingTop: '0.8rem', color: '#F9FAFB', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  borderRadius: '0.8rem',
  border: '1px solid #1f2b52',
  background: '#0c1a3a',
  color: '#F9FAFB',
  marginBottom: '0.8rem',
};

const payButtonStyle: React.CSSProperties = {
  width: '100%',
  background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)',
  color: '#fff',
  fontWeight: 700,
  borderRadius: '1rem',
  padding: '1rem 1.5rem',
  border: 'none',
  boxShadow: '0 2px 12px #1769FA44',
  cursor: 'pointer',
  fontSize: '1rem',
};
