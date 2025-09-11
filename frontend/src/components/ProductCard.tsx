
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFavorites from "../store/useFavorites";
import useCart from "../store/useCart";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
}

export default function ProductCard({ id, title, price, image, description }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggle, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      title,
      price,
      image,
    });
  };

  const handleViewDetails = () => {
    navigate(`/products/${id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({ id, title, price, image });
  };

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
      gap: "1rem",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    onClick={handleViewDetails}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <img 
          src={image} 
          alt={title} 
          style={{ 
            width: "180px", 
            height: "180px", 
            borderRadius: "1rem",
            objectFit: "cover"
          }} 
        />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem", textAlign: "center" }}>{title}</h3>
      <span style={{ fontWeight: 600, color: "#1769FA", fontSize: "1.2rem" }}>${price}</span>
      <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.7rem" }}>
        <button 
          onClick={handleAddToCart}
          style={{
            background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "1rem",
            padding: "0.6rem 1.2rem",
            border: "none",
            boxShadow: "0 2px 8px #1769FA44",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          Add to Cart
        </button>
        <button
          aria-label="toggle favorite"
          onClick={handleToggleFavorite}
          style={{
            background: isFavorite(id) ? "#ef3b58" : "#16224a",
            color: "#fff",
            border: "none",
            borderRadius: "1rem",
            padding: "0.6rem 0.9rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            minWidth: 44
          }}
          title={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite(id) ? "❤" : "♡"}
        </button>
      </div>

    </div>
  );
}
