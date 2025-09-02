
const testimonials = [
  {
    name: "Sarah Johnson",
    avatar: "/vite.svg",
    rating: 5,
    quote: "Amazing platform! I found the perfect template for my business in minutes."
  },
  {
    name: "Michael Chen",
    avatar: "/vite.svg",
    rating: 4,
    quote: "Great selection and easy checkout. Highly recommend!"
  },
];

export default function TestimonialsSection() {
  return (
    <section style={{ width: "100%", marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "#F9FAFB" }}>
        What Our Customers Say
      </h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {testimonials.map((t) => (
          <div key={t.name} style={{
            background: "#102040",
            color: "#F9FAFB",
            borderRadius: "1.2rem",
            padding: "2rem 1.5rem",
            boxShadow: "0 2px 12px #1769FA44",
            maxWidth: "320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <img src={t.avatar} alt={t.name} style={{ width: "64px", height: "64px", borderRadius: "50%", marginBottom: "1rem" }} />
            <div style={{ color: "#FFD700", fontSize: "1.2rem", marginBottom: "0.5rem" }}>{"★".repeat(t.rating)}</div>
            <blockquote style={{ fontStyle: "italic", marginBottom: "0.7rem" }}>
              "{t.quote}"
            </blockquote>
            <span style={{ fontWeight: 600 }}>{t.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
