import React from "react";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useFavorites from "../store/useFavorites";
import useCart from "../store/useCart";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const navigate = useNavigate();
  const { items, remove, clear } = useFavorites();
  const { addItem } = useCart();

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        <Header />

        <section
          style={{
            width: "100%",
            minHeight: "25vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #0A1833 0%, #1769FA 100%)",
            color: "#F9FAFB",
            padding: "2rem",
            borderRadius: "2.5rem",
            marginBottom: "2.5rem",
            boxShadow: "0 4px 32px 0 #1769FA33",
            position: "relative",
            overflow: "hidden",
            fontFamily: "Inter, Segoe UI, Arial, sans-serif",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Favorites</h1>
            <p style={{ color: "#A3AAB8", marginTop: "0.5rem" }}>{items.length} items</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => clear()}
              style={{
                background: "#102040",
                color: "#fff",
                border: "1px solid #1769FA",
                borderRadius: "0.8rem",
                padding: "0.6rem 1rem",
                cursor: "pointer",
              }}
            >
              Clear All
            </button>
          )}
        </section>

        <section>
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#A3AAB8",
                background: "#102040",
                borderRadius: "1.5rem",
                boxShadow: "0 2px 12px #1769FA44",
              }}
            >
              <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>No favorites yet</div>
              <button
                onClick={() => navigate("/products")}
                style={{
                  background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "1rem",
                  padding: "0.7rem 1.5rem",
                  border: "none",
                  boxShadow: "0 2px 8px #1769FA44",
                  cursor: "pointer",
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {items.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: "#102040",
                    borderRadius: "1.2rem",
                    padding: "1rem",
                    color: "#F9FAFB",
                    boxShadow: "0 2px 12px #1769FA44",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "0.8rem" }}
                  />
                  <div style={{ marginTop: "0.8rem", fontWeight: 700 }}>{p.title}</div>
                  <div style={{ color: "#1769FA", fontWeight: 700 }}>${p.price}</div>
                  <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem" }}>
                    <button
                      onClick={() => navigate(`/products/${p.id}`)}
                      style={{
                        background: "#16224a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.6rem",
                        padding: "0.5rem 0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        addItem({ id: p.id, title: p.title, price: p.price, image: p.image })
                      }
                      style={{
                        background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.6rem",
                        padding: "0.5rem 0.8rem",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      style={{
                        background: "#3b3f47",
                        color: "#fff",
                        border: "none",
                        borderRadius: "0.6rem",
                        padding: "0.5rem 0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </main>
    </>
  );
}


