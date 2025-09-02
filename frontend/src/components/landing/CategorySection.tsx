
const categories = [
  { name: "Software", icon: "💻" },
  { name: "Templates", icon: "📄" },
  { name: "E-books", icon: "📚" },
  { name: "Courses", icon: "🎓" },
];

export default function CategorySection() {
  return (
    <section style={{ width: "100%", marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "#F9FAFB" }}>
        Explore Categories
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{
            background: "#102040",
            color: "#F9FAFB",
            borderRadius: "1.2rem",
            padding: "2rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 2px 12px #1769FA44",
            fontWeight: 600,
            fontSize: "1.1rem"
          }}>
            <span style={{ fontSize: "2.5rem", marginBottom: "0.7rem" }}>{cat.icon}</span>
            {cat.name}
          </div>
        ))}
      </div>
    </section>
  );
}
