import React from "react";
import Header from "../components/navbar/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((r) => r.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : (data?.rows || []);
        setProducts(productList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        <Header />
        
        {/* Hero Section */}
        <section
          style={{
            width: "100%",
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0A1833 0%, #1769FA 100%)",
            color: "#F9FAFB",
            padding: "3rem 2rem",
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
              Digital Marketplace
            </span>
            <h1 style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              marginBottom: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-2px"
            }}>
              Our <span style={{ color: "#1769FA" }}>Products</span>
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: "2.2rem", color: "#A3AAB8", fontWeight: 500, maxWidth: "600px", margin: "0 auto 2.2rem auto" }}>
              Discover our collection of premium digital products. From templates to courses, find everything you need to boost your creativity and productivity.
            </p>
            <div style={{ color: "#A3AAB8", fontSize: "1rem" }}>
              <span style={{ opacity: 0.7 }}>{products.length} products available</span>
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ 
            background: "#102040", 
            borderRadius: "1.5rem", 
            padding: "2rem", 
            boxShadow: "0 2px 12px #1769FA44" 
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "2rem" 
            }}>
              <h2 style={{ 
                fontSize: "1.8rem", 
                fontWeight: 700, 
                color: "#F9FAFB",
                margin: 0
              }}>
                All Products
              </h2>
              <div style={{ 
                color: "#A3AAB8", 
                fontSize: "1rem" 
              }}>
                {loading ? "Loading..." : `${products.length} items`}
              </div>
            </div>

            {loading ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#A3AAB8" 
              }}>
                <div style={{ fontSize: "1.2rem" }}>Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#A3AAB8" 
              }}>
                <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>No products found</div>
                <div style={{ fontSize: "1rem", opacity: 0.7 }}>Check back later for new additions!</div>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '2rem' 
              }}>
                {products.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    id={p.id}
                    title={p.title} 
                    price={p.price} 
                    image={p.images?.[0]?.url || "http://localhost:5173/vite.svg"}
                    description={p.description}
                  />
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
