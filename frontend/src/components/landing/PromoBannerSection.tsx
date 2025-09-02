
export default function PromoBannerSection() {
  return (
    <section style={{
      width: "100%",
      background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
      color: "#fff",
      borderRadius: "1.5rem",
      padding: "1.5rem 2rem",
      marginBottom: "2rem",
      boxShadow: "0 2px 12px #1769FA44",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div>
        <h3 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem" }}>
          Limited Time Offer!
        </h3>
        <p style={{ fontSize: "1rem" }}>
          Save up to 30% on bundles and top products. Hurry, ends soon!
        </p>
      </div>
      {/* You can add a carousel/slider here for multiple offers */}
    </section>
  );
}
