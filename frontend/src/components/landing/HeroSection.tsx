
export default function HeroSection() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0A1833 0%, #1769FA 100%)",
        color: "#F9FAFB",
        padding: "4rem 2rem 3rem 2rem",
        borderRadius: "2.5rem",
        marginBottom: "2.5rem",
        boxShadow: "0 4px 32px 0 #1769FA33",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif"
      }}
    >
      {/* Gradient overlay for extra depth */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(120deg, #1769FA44 0%, #0A1833 80%)",
        zIndex: 0,
        borderRadius: "2.5rem"
      }} />
      <div style={{ maxWidth: "600px", position: "relative", zIndex: 1 }}>
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
          Your Digital Marketplace
        </span>
        <h1 style={{
          fontSize: "3.2rem",
          fontWeight: 900,
          marginBottom: "1.2rem",
          lineHeight: 1.1,
          letterSpacing: "-2px"
        }}>
          Buy  Digital Products<br />
          <span style={{ color: "#fff" }}>Templates, E-books, Courses & More</span>
        </h1>
        <p style={{ fontSize: "1.25rem", marginBottom: "2.2rem", color: "#A3AAB8", fontWeight: 500 }}>
          Instantly access top-rated software, design assets, e-books, and online courses. Secure checkout, instant delivery, and exclusive deals for creators and buyers.
        </p>
        <div style={{ display: "flex", gap: "1.2rem" }}>
          <button style={{
            background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "1.5rem",
            padding: "0.9rem 2.2rem",
            fontSize: "1.1rem",
            border: "none",
            boxShadow: "0 2px 12px 0 #1769FA44",
            cursor: "pointer"
          }}>
            Explore Products
          </button>
          <button style={{
            background: "#102040",
            color: "#F9FAFB",
            fontWeight: 700,
            borderRadius: "1.5rem",
            padding: "0.9rem 2.2rem",
            fontSize: "1.1rem",
            border: "none",
            boxShadow: "0 2px 12px 0 #1769FA22",
            cursor: "pointer"
          }}>
            Sell Your Product
          </button>
        </div>
        <div style={{ marginTop: "1.2rem", color: "#A3AAB8", fontSize: "1rem" }}>
          <span style={{ opacity: 0.7 }}>Instant access. No credit card required for browsing.</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        {/* Replace with your digital artwork or image */}
        <img src="/vite.svg" alt="Digital Banner" style={{ width: "340px", borderRadius: "2rem", boxShadow: "0 2px 24px #1769FA44" }} />
      </div>
    </section>
  );
}
