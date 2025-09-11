import React from "react";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";

export default function Orders() {
  const orders: any[] = [];

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

            {orders.length === 0 ? (
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
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ 
                          background: order.status === "Delivered" ? "#10B981" : "#F59E0B",
                          color: "#fff",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          marginBottom: "0.5rem"
                        }}>
                          {order.status}
                        </div>
                        <div style={{ color: "#1769FA", fontSize: "1.1rem", fontWeight: 600 }}>
                          ${order.total.toFixed(2)}
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
                          <span>{item.title} (Qty: {item.quantity})</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button style={{
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
                      <button style={{
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

        <Footer />
      </main>
    </>
  );
}
