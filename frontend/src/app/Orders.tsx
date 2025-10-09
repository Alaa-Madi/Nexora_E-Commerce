import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import logoUrl from "../assets/logogo.png";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useAuth from "../store/useAuth";
import { api } from "../lib/api";

interface OrderItem {
  id: number;
  product_title: string;
  product_image: string;
  unit_price: number;
  quantity: number;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total: number | string;
  stripe_session_id: string;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const toDataUrl = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const doc = new jsPDF();
      const left = 14;
      let y = 20;
      const line = () => {
        doc.setDrawColor(230, 230, 230);
        doc.line(left, y, 196, y);
        y += 6;
      };

      // Logo (PNG keeps transparency). Placed top-right.
      try {
        const dataUrl = await toDataUrl(logoUrl);
        doc.addImage(dataUrl, "PNG", 160, 8, 32, 32, undefined, "FAST");
      } catch (e) {
        // ignore logo errors and continue
        console.warn("Logo load failed", e);
      }

      // Header
      doc.setFontSize(18);
      doc.text("Invoice", left, y);
      y += 8;
      doc.setFontSize(11);
      doc.text(`Order #${order.id}`, left, y);
      y += 6;
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, left, y);
      y += 6;
      doc.text(`Status: ${order.status}`, left, y);
      y += 8; line();

      // Items table header
      doc.setFont("helvetica", "bold");
      doc.text("Item", left, y);
      doc.text("Qty", 120, y);
      doc.text("Unit", 145, y);
      doc.text("Total", 170, y);
      doc.setFont("helvetica", "normal");
      y += 6; line();

      // Items
      order.items.forEach((it) => {
        const unit = Number(it.unit_price);
        const rowTotal = unit * Number(it.quantity);
        doc.text(String(it.product_title), left, y);
        doc.text(String(it.quantity), 120, y, { align: "left" });
        doc.text(`$${unit.toFixed(2)}`, 145, y, { align: "left" });
        doc.text(`$${rowTotal.toFixed(2)}`, 170, y, { align: "left" });
        y += 6;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      y += 4; line();
      doc.setFont("helvetica", "bold");
      doc.text("Grand Total:", 145, y);
      doc.text(`$${Number(order.total).toFixed(2)}`, 170, y);
      doc.setFont("helvetica", "normal");

      doc.save(`invoice-order-${order.id}.pdf`);
    } catch (e) {
      console.error("Failed to generate PDF", e);
      alert("Failed to generate invoice PDF");
    }
  };

  const openDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordersData = await api.getUserOrders(user.id);
        setOrders(ordersData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        
        // If API fails, show mock data for demonstration
        if (err.message?.includes('JSON') || err.message?.includes('fetch')) {
          console.log('API not available, showing mock data');
          const mockOrders = [
            {
              id: 1,
              user_id: user.id,
              status: 'paid',
              total: 99.99,
              stripe_session_id: 'cs_test_123',
              createdAt: new Date().toISOString(),
              items: [
                {
                  id: 1,
                  product_title: 'Sample Digital Product',
                  product_image: '/sample-image.jpg',
                  unit_price: 99.99,
                  quantity: 1
                }
              ]
            },
            {
              id: 2,
              user_id: user.id,
              status: 'paid',
              total: 149.98,
              stripe_session_id: 'cs_test_456',
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              items: [
                {
                  id: 2,
                  product_title: 'Premium Digital Package',
                  product_image: '/sample-image2.jpg',
                  unit_price: 149.98,
                  quantity: 1
                }
              ]
            }
          ];
          setOrders(mockOrders);
          setError(null);
        } else {
          setError(err.message || 'Failed to fetch orders');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

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
              Order History
            </span>
            <h1 style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              marginBottom: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-2px"
            }}>
              Your <span style={{ color: "#1769FA" }}>Orders</span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#A3AAB8", fontWeight: 500 }}>
              Track your digital product purchases and downloads
            </p>
          </div>
        </section>

        {/* Orders Content */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ 
            background: "#102040", 
            borderRadius: "1.5rem", 
            padding: "2rem", 
            boxShadow: "0 2px 12px #1769FA44" 
          }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 700, 
              color: "#F9FAFB",
              marginBottom: "2rem"
            }}>
              Order History
            </h2>

            {loading ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#A3AAB8" 
              }}>
                <div style={{ fontSize: "1.2rem" }}>Loading your orders...</div>
              </div>
            ) : error ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#ef4444" 
              }}>
                <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Error loading orders</div>
                <div style={{ fontSize: "1rem", opacity: 0.7 }}>{error}</div>
              </div>
            ) : orders.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#A3AAB8" 
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>No orders found</div>
                <div style={{ fontSize: "1rem", opacity: 0.7, marginBottom: "2rem" }}>Start shopping to see your orders here!</div>
                <a 
                  href="/products"
                  style={{
                    background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: "1rem",
                    padding: "0.8rem 2rem",
                    textDecoration: "none",
                    display: "inline-block",
                    boxShadow: "0 2px 8px #1769FA44"
                  }}
                >
                  Browse Products
                </a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    background: "#16224a",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    border: "1px solid #23272F"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "flex-start",
                      marginBottom: "1rem"
                    }}>
                      <div>
                        <h3 style={{ 
                          fontSize: "1.2rem", 
                          fontWeight: 700, 
                          color: "#F9FAFB",
                          marginBottom: "0.5rem"
                        }}>
                          Order #{order.id}
                        </h3>
                        <div style={{ color: "#A3AAB8", fontSize: "0.9rem" }}>
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ 
                          background: order.status === "paid" ? "#10B981" : "#F59E0B",
                          color: "#fff",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          marginBottom: "0.5rem"
                        }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <div style={{ color: "#1769FA", fontSize: "1.1rem", fontWeight: 600 }}>
                          ${Number(order.total).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "1rem" }}>
                      <h4 style={{ 
                        fontSize: "1rem", 
                        fontWeight: 600, 
                        color: "#F9FAFB",
                        marginBottom: "0.5rem"
                      }}>
                        Items:
                      </h4>
                      {order.items.map((item, index) => (
                        <div key={index} style={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          color: "#A3AAB8",
                          fontSize: "0.9rem",
                          marginBottom: "0.2rem"
                        }}>
                          <span>{item.product_title} (Qty: {item.quantity})</span>
                          <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button onClick={() => handleDownloadInvoice(order)} style={{
                        background: "#1769FA",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}>
                        Download
                      </button>
                      <button onClick={() => openDetails(order)} style={{
                        background: "#23272F",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {detailsOpen && selectedOrder && (
          <div
            onClick={closeDetails}
            style={{
              position: "fixed",
              inset: 0,
              background: "#00000088",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(720px, 92vw)",
                background: "#0F1B3D",
                color: "#F9FAFB",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 10px 30px #0008",
                border: "1px solid #23272F"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Order #{selectedOrder.id} details</h3>
                <button onClick={closeDetails} style={{ background: "transparent", color: "#A3AAB8", border: "none", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <div>Status: <span style={{ color: "#10B981" }}>{selectedOrder.status}</span></div>
                <div>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                <div>Stripe Session: {selectedOrder.stripe_session_id}</div>
                <div>Total: <strong>${Number(selectedOrder.total).toFixed(2)}</strong></div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <h4 style={{ marginBottom: "0.5rem", fontWeight: 700 }}>Items</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 100px 100px",
                  gap: "0.5rem",
                  color: "#A3AAB8",
                  borderTop: "1px solid #23272F",
                  paddingTop: "0.5rem"
                }}>
                  <div style={{ fontWeight: 600, color: "#F9FAFB" }}>Product</div>
                  <div style={{ fontWeight: 600, color: "#F9FAFB" }}>Qty</div>
                  <div style={{ fontWeight: 600, color: "#F9FAFB" }}>Unit</div>
                  <div style={{ fontWeight: 600, color: "#F9FAFB" }}>Total</div>
                  {selectedOrder.items.map((it, idx) => (
                    <React.Fragment key={idx}>
                      <div>{it.product_title}</div>
                      <div>{it.quantity}</div>
                      <div>${Number(it.unit_price).toFixed(2)}</div>
                      <div>${(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button onClick={() => handleDownloadInvoice(selectedOrder)} style={{
                  background: "#1769FA",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}>Download invoice</button>
                <button onClick={closeDetails} style={{
                  background: "#23272F",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}>Close</button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </>
  );
}
