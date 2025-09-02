
import React, { useState } from "react";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
}

export default function ProductCard({ title, price, image }: ProductCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: "#102040",
      borderRadius: "1.2rem",
      boxShadow: "0 2px 12px #1769FA44",
      padding: "1.5rem",
      color: "#F9FAFB",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    }}>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          marginBottom: "1rem",
          cursor: "pointer"
        }}
        aria-label={`View details for ${title}`}
      >
        <img src={image} alt={title} style={{ width: "100px", height: "100px", borderRadius: "1rem" }} />
      </button>
      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h3>
      <span style={{ fontWeight: 600, color: "#1769FA", fontSize: "1rem" }}>{price}</span>
      <button style={{
        background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
        color: "#fff",
        fontWeight: 700,
        borderRadius: "1rem",
        padding: "0.5rem 1.2rem",
        border: "none",
        boxShadow: "0 2px 8px #1769FA44",
        cursor: "pointer",
        marginTop: "0.7rem"
      }}>
        Add to Cart
      </button>

      {/* Dialog for product details */}
      {open && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(10,24,51,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#102040",
            color: "#F9FAFB",
            borderRadius: "1.5rem",
            boxShadow: "0 2px 24px #1769FA44",
            padding: "2rem",
            minWidth: "320px",
            maxWidth: "90vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          }}>
            <img src={image} alt={title} style={{ width: "160px", height: "160px", borderRadius: "1.2rem", marginBottom: "1rem" }} />
            <h2 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.7rem" }}>{title}</h2>
            <span style={{ fontWeight: 700, color: "#1769FA", fontSize: "1.2rem", marginBottom: "1rem" }}>{price}</span>
            <p style={{ color: "#A3AAB8", fontSize: "1rem", marginBottom: "1.2rem", textAlign: "center" }}>
              Product details and description go here.
            </p>
            <button style={{
              background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "1rem",
              padding: "0.7rem 1.5rem",
              border: "none",
              boxShadow: "0 2px 8px #1769FA44",
              cursor: "pointer",
              marginBottom: "1rem"
            }}>
              Add to Cart
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "#23272F",
                color: "#fff",
                border: "none",
                borderRadius: "1rem",
                padding: "0.5rem 1.2rem",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
