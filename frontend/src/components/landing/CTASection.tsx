
export default function CTASection() {
  return (
    <section style={{
      width: "100%",
      background: "#1769FA",
      color: "#fff",
      borderRadius: "1.5rem",
      padding: "2rem 2rem",
      marginBottom: "2rem",
      boxShadow: "0 2px 12px #1769FA44",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem" }}>
          Join now & get 10% off your first purchase!
        </h3>
        <form style={{ display: "flex", gap: "1rem" }}>
          <input type="email" placeholder="Your email" style={{
            padding: "0.7rem 1.2rem",
            borderRadius: "1rem",
            border: "none",
            fontSize: "1rem",
            outline: "none"
          }} />
          <button type="submit" style={{
            background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
            color: "#fff",
            fontWeight: 700,
            borderRadius: "1rem",
            padding: "0.7rem 1.5rem",
            border: "none",
            boxShadow: "0 2px 8px #1769FA44",
            cursor: "pointer"
          }}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
