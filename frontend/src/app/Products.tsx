import React from "react";
import Header from "../components/navbar/Header";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = React.useState<any[]>([]);
  React.useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {products.map((p) => (
            <ProductCard key={p.id} title={p.title} price={`$${p.price}`} image={p.images?.[0]?.url || "/vite.svg"} />
          ))}
        </div>
      </div>
    </>
  );
}
