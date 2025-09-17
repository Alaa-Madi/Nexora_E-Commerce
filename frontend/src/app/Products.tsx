import React from "react";
import Header from "../components/navbar/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useAuth } from "../store/useAuth";

export default function Products() {
  const { role } = useAuth();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [productCount, setProductCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openCategories, setOpenCategories] = React.useState(false);
  const [categories, setCategories] = React.useState<{ id: number; name: string; slug: string }[]>([]);
  const [newCategory, setNewCategory] = React.useState({ name: "", slug: "" });
  const [productForm, setProductForm] = React.useState({ title: "", price: "", category_id: "", description: "", sku: "", stock: "", slug: "", imageUrl: "" });
  const [editingProduct, setEditingProduct] = React.useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<any>(null);
  const pageSize = 15;
  const isAdmin = role === 'admin';

  React.useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const loadProducts = React.useCallback(() => {
    fetch(`http://localhost:5000/api/products?limit=${pageSize}&page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        const rows = Array.isArray(data) ? data : (data?.rows || []);
        const count = Array.isArray(data) ? rows.length : (data?.count || 0);
        setProducts(rows);
        setProductCount(count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  React.useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleDelete = async (productId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        alert('Product deleted successfully');
        loadProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Error deleting product');
    }
    setDeleteConfirm(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || '',
      price: product.price?.toString() || '',
      category_id: product.category_id?.toString() || '',
      description: product.description || '',
      sku: product.sku || '',
      stock: product.stock?.toString() || '',
      slug: product.slug || '',
      imageUrl: product.images?.[0]?.url || ''
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title: productForm.title,
      slug: productForm.slug,
      description: productForm.description,
      price: Number(productForm.price),
      sku: productForm.sku,
      stock: Number(productForm.stock || 0),
      category_id: Number(productForm.category_id),
      images: productForm.imageUrl ? [productForm.imageUrl] : [],
    };

    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setOpen(false);
        setEditingProduct(null);
        setProductForm({ title: '', price: '', category_id: '', description: '', sku: '', stock: '', slug: '', imageUrl: '' });
        alert(editingProduct ? 'Product updated successfully' : 'Product added successfully');
        loadProducts();
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          alert(data.error || `Failed to ${editingProduct ? 'update' : 'add'} product (status ${res.status})`);
        } catch {
          alert(text || `Failed to ${editingProduct ? 'update' : 'add'} product (status ${res.status})`);
        }
      }
    } catch (error) {
      alert(`Error ${editingProduct ? 'updating' : 'adding'} product`);
    }
  };

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
                display: "flex", 
                alignItems: "center", 
                gap: "1rem" 
              }}>
                <div style={{ 
                  color: "#A3AAB8", 
                  fontSize: "1rem" 
                }}>
                  {loading ? "Loading..." : `${productCount} items`}
                </div>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setOpen(true)}
                      style={{
                        background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: '1rem',
                        padding: '0.6rem 1.5rem',
                        fontSize: '0.9rem',
                        border: 'none',
                        boxShadow: '0 2px 8px #1769FA44',
                        cursor: 'pointer'
                      }}
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => setOpenCategories(true)}
                      style={{
                        background: '#7C3AED',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: '1rem',
                        padding: '0.6rem 1.5rem',
                        fontSize: '0.9rem',
                        border: 'none',
                        boxShadow: '0 2px 8px #7C3AED44',
                        cursor: 'pointer'
                      }}
                    >
                      Categories
                    </button>
                  </>
                )}
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
            ) : isAdmin ? (
              // Admin Table View
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                  <thead>
                    <tr style={{ background: '#1769FA', color: '#fff' }}>
                      <th style={{ padding: '0.7rem', borderRadius: '0.5rem 0 0 0.5rem', textAlign:'left' }}>Title</th>
                      <th style={{ padding: '0.7rem', textAlign:'left' }}>Price</th>
                      <th style={{ padding: '0.7rem', textAlign:'left' }}>Stock</th>
                      <th style={{ padding: '0.7rem', textAlign:'left' }}>Category</th>
                      <th style={{ padding: '0.7rem', textAlign:'left' }}>Created</th>
                      <th style={{ padding: '0.7rem', textAlign:'left', borderRadius: '0 0.5rem 0.5rem 0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p)=> (
                      <tr key={p.id} style={{ background: '#23272F', color: '#F9FAFB' }}>
                        <td style={{ padding: '0.7rem' }}>{p.title}</td>
                        <td style={{ padding: '0.7rem' }}>${p.price}</td>
                        <td style={{ padding: '0.7rem' }}>{p.stock}</td>
                        <td style={{ padding: '0.7rem' }}>{p.Category?.name || '-'}</td>
                        <td style={{ padding: '0.7rem' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '0.7rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEdit(p)}
                              style={{
                                background: '#10B981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p)}
                              style={{
                                background: '#EF4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                padding: '0.4rem 0.8rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1rem' }}>
                  <div style={{ color:'#A3AAB8' }}>Total: {productCount}</div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))} style={{ background:'#23272F', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.4rem 0.9rem', cursor:'pointer', opacity: page<=1?0.5:1 }}>Prev</button>
                    <span style={{ alignSelf:'center' }}>Page {page} / {Math.max(1, Math.ceil(productCount / pageSize))}</span>
                    <button disabled={page>=Math.ceil(productCount/pageSize)} onClick={()=>setPage((p)=>p+1)} style={{ background:'#23272F', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.4rem 0.9rem', cursor:'pointer', opacity: page>=Math.ceil(productCount/pageSize)?0.5:1 }}>Next</button>
                  </div>
                </div>
              </div>
            ) : (
              // Regular User Grid View
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

      {/* Add/Edit Product Dialog */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(10,24,51,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#102040',
            color: '#F9FAFB',
            borderRadius: '1.5rem',
            boxShadow: '0 2px 24px #1769FA44',
            padding: '2.5rem 3rem',
            minWidth: '480px',
            maxWidth: '700px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
            >
              <input value={productForm.title} onChange={(e)=>setProductForm({...productForm,title:e.target.value})} type="text" placeholder="Title" required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <input value={productForm.slug} onChange={(e)=>setProductForm({...productForm,slug:e.target.value})} type="text" placeholder="Slug" required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <textarea value={productForm.description} onChange={(e)=>setProductForm({...productForm,description:e.target.value})} placeholder="Description" required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <input value={productForm.price} onChange={(e)=>setProductForm({...productForm,price:e.target.value})} type="number" step="0.01" placeholder="Price" required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <input value={productForm.sku} onChange={(e)=>setProductForm({...productForm,sku:e.target.value})} type="text" placeholder="SKU" required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <input value={productForm.stock} onChange={(e)=>setProductForm({...productForm,stock:e.target.value})} type="number" placeholder="Stock" required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <select value={productForm.category_id} onChange={(e)=>setProductForm({...productForm,category_id:e.target.value})} required style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }}>
                <option value="">Select Category</option>
                {categories.map((c)=> (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input value={productForm.imageUrl} onChange={(e)=>setProductForm({...productForm,imageUrl:e.target.value})} type="text" placeholder="Image URL" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <button type="submit" style={{ background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)', color: '#fff', fontWeight: 700, borderRadius: '1rem', padding: '0.7rem 1.5rem', border: 'none', boxShadow: '0 2px 8px #1769FA44', cursor: 'pointer' }}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
            <button
              onClick={() => {
                setOpen(false);
                setEditingProduct(null);
                setProductForm({ title: '', price: '', category_id: '', description: '', sku: '', stock: '', slug: '', imageUrl: '' });
              }}
              style={{
                background: '#23272F',
                color: '#fff',
                border: 'none',
                borderRadius: '1rem',
                padding: '0.5rem 1.2rem',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Categories Dialog */}
      {openCategories && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10,24,51,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', boxShadow: '0 2px 24px #7C3AED44', padding: '2.5rem 3rem', minWidth: '420px', width: '100%' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>Manage Categories</h2>
            <form
              onSubmit={async (e)=>{
                e.preventDefault();
                const res = await fetch('http://localhost:5000/api/categories', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCategory)
                });
                if (res.ok) {
                  const created = await res.json();
                  setCategories((prev)=>[...prev, created]);
                  setNewCategory({ name: '', slug: '' });
                } else {
                  const text = await res.text();
                  try {
                    const data = JSON.parse(text);
                    alert(data.error || `Failed to create category (status ${res.status})`);
                  } catch {
                    alert(text || `Failed to create category (status ${res.status})`);
                  }
                }
              }}
              style={{ display: 'flex', gap: '0.7rem', marginBottom: '1rem' }}
            >
              <input value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory, name:e.target.value})} placeholder="Name" required style={{ padding: '0.6rem', borderRadius: '0.8rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <input value={newCategory.slug} onChange={(e)=>setNewCategory({...newCategory, slug:e.target.value})} placeholder="Slug" required style={{ padding: '0.6rem', borderRadius: '0.8rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
              <button type="submit" style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '0.8rem', padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer' }}>Add</button>
            </form>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {categories.map((c)=> (
                <li key={c.id} style={{ background: '#23272F', padding: '0.6rem 0.8rem', borderRadius: '0.8rem', marginBottom: '0.5rem' }}>
                  {c.name} <span style={{ color: '#A3AAB8' }}>({c.slug})</span>
                </li>
              ))}
            </ul>
            <button onClick={()=>setOpenCategories(false)} style={{ background:'#23272F', color:'#fff', border:'none', borderRadius:'0.8rem', padding:'0.5rem 1rem', marginTop:'1rem', cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(10,24,51,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#102040',
            color: '#F9FAFB',
            borderRadius: '1.5rem',
            boxShadow: '0 2px 24px #EF444444',
            padding: '2.5rem 3rem',
            minWidth: '400px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem', color: '#EF4444' }}>
              Confirm Delete
            </h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  background: '#6B7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '0.7rem 1.5rem',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                style={{
                  background: '#EF4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '0.7rem 1.5rem',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
