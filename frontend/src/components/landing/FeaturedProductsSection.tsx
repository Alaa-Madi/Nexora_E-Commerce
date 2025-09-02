import ProductCard from "../ProductCard";

// Example featured products
const products = [
  { id: 1, title: "Pro Design Template", price: "$19", image: "/vite.svg" },
  { id: 2, title: "E-book: Learn React", price: "$9", image: "/vite.svg" },
  { id: 3, title: "Course: Next.js Mastery", price: "$29", image: "/vite.svg" },
];

export default function FeaturedProductsSection() {
  return (
    <section style={{ width: "100%", marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", color: "#F9FAFB" }}>
        Featured Products
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
