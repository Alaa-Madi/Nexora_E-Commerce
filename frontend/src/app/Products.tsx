import React from "react";
import Header from "../components/navbar/Header";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../store/useAuth";

export default function Products() {
  const { role } = useAuth();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [productCount, setProductCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const categoriesRef = React.useRef<HTMLDivElement | null>(null);
  const [categories, setCategories] = React.useState<{ id: number; name: string; slug: string; productCount?: number }[]>([]);
  const [newCategory, setNewCategory] = React.useState({ name: "", slug: "" });
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = React.useState<any>(null);
  const [categoryError, setCategoryError] = React.useState<string | null>(null);
  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [categoryPage, setCategoryPage] = React.useState(1);
  const [categoryCount, setCategoryCount] = React.useState(0);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 3000);
  };
  const [productForm, setProductForm] = React.useState({ title: "", price: "", category_id: "", description: "", sku: "", stock: "", slug: "", imageUrls: [] as string[] });
  const [editingProduct, setEditingProduct] = React.useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<any>(null);
  const pageSize = 15;
  const isAdmin = role === 'admin';

  React.useEffect(() => {
    const limit = 15;
    fetch(`http://localhost:5000/api/categories?limit=${limit}&page=${categoryPage}`)
      .then((r) => r.json())
      .then((data) => {
        const rows = Array.isArray(data) ? data : (data?.rows || []);
        const count = Array.isArray(data) ? rows.length : (data?.count || 0);
        
        // Add productCount to each category
        const categoriesWithCount = rows.map((category: any) => ({
          ...category,
          productCount: category.Products ? category.Products.length : 0
        }));
        
        setCategories(categoriesWithCount);
        setCategoryCount(count);
        console.log('Categories data:', { data, rows: categoriesWithCount, count }); // Debug log
      })
      .catch((err) => {
        console.error('Categories fetch error:', err);
        setCategories([]);
        setCategoryCount(0);
      });
  }, [categoryPage]);

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
        showToast('Product deleted successfully', 'success');
        loadProducts();
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (error) {
      showToast('Error deleting product', 'error');
    }
    setDeleteConfirm(null);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        setCategories((prev)=>prev.filter(c=>c.id!==categoryId));
        showToast('Category deleted successfully', 'success');
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          const msg = data.error || 'Failed to delete category';
          setCategoryError(msg);
          showToast(msg, 'error');
        } catch {
          const msg = text || 'Failed to delete category';
          setCategoryError(msg);
          showToast(msg, 'error');
        }
      }
    } catch (e) {
      setCategoryError('Error deleting category');
      showToast('Error deleting category', 'error');
    }
    setDeleteCategoryConfirm(null);
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
      imageUrls: product.images?.map((img: any) => img.url) || []
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!productForm.title.trim()) {
      showToast('Product title is required', 'error');
      return;
    }
    if (!productForm.slug.trim()) {
      showToast('Product slug is required', 'error');
      return;
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      showToast('Valid price is required', 'error');
      return;
    }
    if (!productForm.category_id || productForm.category_id === '') {
      showToast('Please select a category', 'error');
      return;
    }
    
    const body = {
      title: productForm.title.trim(),
      slug: productForm.slug.trim(),
      description: productForm.description.trim(),
      price: Number(productForm.price),
      sku: productForm.sku.trim(),
      stock: Number(productForm.stock || 0),
      category_id: Number(productForm.category_id),
      images: productForm.imageUrls.filter((url: string) => url.trim() !== ''),
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
        setProductForm({ title: '', price: '', category_id: '', description: '', sku: '', stock: '', slug: '', imageUrls: [] as string[] });
        showToast(editingProduct ? 'Product updated successfully' : 'Product added successfully', 'success');
        loadProducts();
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          showToast(data.error || `Failed to ${editingProduct ? 'update' : 'add'} product (status ${res.status})`, 'error');
        } catch {
          showToast(text || `Failed to ${editingProduct ? 'update' : 'add'} product (status ${res.status})`, 'error');
        }
      }
    } catch (error) {
      showToast(`Error ${editingProduct ? 'updating' : 'adding'} product`, 'error');
    }
  };

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        <Header />
        
        {/* Products Grid Section */}
        <section style={{ marginBottom: "2.5rem", marginTop:"2.5rem"}}>
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

        {/* Categories Section Below Products */}
        {isAdmin && (
          <section ref={categoriesRef} style={{ margin: '2.5rem 0' }}>
            <div style={{ background:'#102040', borderRadius:'1.5rem', padding:'2rem', boxShadow:'0 2px 12px #7C3AED44' }}>
              
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <h2 style={{ fontSize:'1.6rem', fontWeight:700, color:'#F9FAFB', margin:0 }}>Categories</h2>
                 <button
                       onClick={() => setOpenAddCategory(true)}
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
                       Add Category
                    </button>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', marginTop:'1rem' }}>
                  <thead>
                    <tr style={{ background:'#7C3AED', color:'#fff' }}>
                      <th style={{ padding:'0.7rem', borderRadius:'0.5rem 0 0 0.5rem', textAlign:'left' }}>Name</th>
                      <th style={{ padding:'0.7rem', textAlign:'left' }}>Slug</th>
                      <th style={{ padding:'0.7rem', textAlign:'left' }}>Products</th>
                      <th style={{ padding:'0.7rem', textAlign:'left', borderRadius:'0 0.5rem 0.5rem 0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c)=> (
                      <tr key={c.id} style={{ background:'#23272F', color:'#F9FAFB' }}>
                        <td style={{ padding:'0.7rem' }}>{c.name}</td>
                        <td style={{ padding:'0.7rem' }}>{c.slug}</td>
                        <td style={{ padding:'0.7rem' }}>{c.productCount ?? '-'}</td>
                        <td style={{ padding:'0.7rem' }}>
                          <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button
                              onClick={() => setDeleteCategoryConfirm(c)}
                              style={{ background:'#EF4444', color:'#fff', border:'none', borderRadius:'0.5rem', padding:'0.4rem 0.8rem', cursor:'pointer', fontSize:'0.8rem' }}
                              disabled={(c.productCount ?? 0) > 0}
                              title={(c.productCount ?? 0) > 0 ? 'Cannot delete: category has products' : 'Delete category'}
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
                  <div style={{ color:'#A3AAB8' }}>Total: {categoryCount}</div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button
                      disabled={categoryPage <= 1}
                      onClick={() => setCategoryPage((p)=>Math.max(1, p-1))}
                      style={{ background:'#23272F', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.4rem 0.9rem', cursor:'pointer', opacity: categoryPage<=1?0.5:1 }}
                    >Prev</button>
                    <span style={{ alignSelf:'center' }}>Page {categoryPage} / {Math.max(1, Math.ceil(categoryCount / 15))}</span>
                    <button
                      disabled={categoryPage >= Math.ceil(categoryCount / 15)}
                      onClick={() => setCategoryPage((p)=>p+1)}
                      style={{ background:'#23272F', color:'#fff', border:'none', borderRadius:'0.7rem', padding:'0.4rem 0.9rem', cursor:'pointer', opacity: categoryPage>=Math.ceil(categoryCount/15)?0.5:1 }}
                    >Next</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#F9FAFB', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                  Product Images (add multiple URLs, one per line):
                </label>
                <textarea
                  value={productForm.imageUrls.join('\n')}
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').map(url => url.trim()).filter(url => url !== '');
                    setProductForm({...productForm, imageUrls: urls});
                  }}
                  placeholder="Image URL 1&#10;Image URL 2&#10;Image URL 3"
                  rows={4}
                  style={{ 
                    padding: '0.7rem', 
                    borderRadius: '1rem', 
                    border: 'none', 
                    fontSize: '1rem', 
                    background:'#16224a', 
                    color:'#F9FAFB',
                    width: '100%',
                    resize: 'vertical'
                  }}
                />
                {productForm.imageUrls.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#A3AAB8' }}>
                    {productForm.imageUrls.length} image{productForm.imageUrls.length !== 1 ? 's' : ''} added
                  </div>
                )}
              </div>
              <button type="submit" style={{ background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)', color: '#fff', fontWeight: 700, borderRadius: '1rem', padding: '0.7rem 1.5rem', border: 'none', boxShadow: '0 2px 8px #1769FA44', cursor: 'pointer' }}>
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
            <button
              onClick={() => {
                setOpen(false);
                setEditingProduct(null);
                setProductForm({ title: '', price: '', category_id: '', description: '', sku: '', stock: '', slug: '', imageUrls: [] as string[] });
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

      {/* Categories Dialog removed in favor of inline section */}

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

      {/* Delete Category Confirmation (matches product delete modal) */}
      {deleteCategoryConfirm && (
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
              Are you sure you want to delete "{deleteCategoryConfirm.name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteCategoryConfirm(null)}
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
                onClick={() => handleDeleteCategory(deleteCategoryConfirm.id)}
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

      {/* Category Error Popup */}
      {categoryError && (
        <div style={{ position:'fixed', bottom:'2rem', right:'2rem', background:'#B91C1C', color:'#fff', padding:'1rem 1.2rem', borderRadius:'0.8rem', boxShadow:'0 2px 12px #00000033', zIndex:1100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
            <span>⚠️</span>
            <span>{categoryError}</span>
            <button onClick={()=>setCategoryError(null)} style={{ marginLeft:'0.8rem', background:'transparent', border:'1px solid #fff', color:'#fff', borderRadius:'0.5rem', padding:'0.2rem 0.5rem', cursor:'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {openAddCategory && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(10,24,51,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
          <div style={{ background:'#102040', color:'#F9FAFB', borderRadius:'1.5rem', boxShadow:'0 2px 24px #7C3AED44', padding:'2rem 2.5rem', minWidth:'420px', width:'100%' }}>
            <h2 style={{ fontWeight:800, fontSize:'1.4rem', marginBottom:'1rem' }}>Add Category</h2>
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
                  setOpenAddCategory(false);
                  showToast('Category added successfully', 'success');
                } else {
                  const text = await res.text();
                  try {
                    const data = JSON.parse(text);
                    const msg = data.error || `Failed to create category (status ${res.status})`;
                    setCategoryError(msg);
                    showToast(msg, 'error');
                  } catch {
                    const msg = text || `Failed to create category (status ${res.status})`;
                    setCategoryError(msg);
                    showToast(msg, 'error');
                  }
                }
              }}
              style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}
            >
              <input value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory, name:e.target.value})} placeholder="Name" required style={{ padding: '0.7rem', borderRadius:'0.8rem', border:'none', fontSize:'1rem', background:'#16224a', color:'#F9FAFB' }} />
              <input value={newCategory.slug} onChange={(e)=>setNewCategory({...newCategory, slug:e.target.value})} placeholder="Slug" required style={{ padding: '0.7rem', borderRadius:'0.8rem', border:'none', fontSize:'1rem', background:'#16224a', color:'#F9FAFB' }} />
              <div style={{ display:'flex', gap:'0.6rem', justifyContent:'flex-end', marginTop:'0.5rem' }}>
                <button type="button" onClick={()=>setOpenAddCategory(false)} style={{ background:'#6B7280', color:'#fff', border:'none', borderRadius:'0.8rem', padding:'0.6rem 1.2rem', cursor:'pointer', fontWeight:700 }}>Cancel</button>
                <button type="submit" style={{ background:'#7C3AED', color:'#fff', border:'none', borderRadius:'0.8rem', padding:'0.6rem 1.2rem', cursor:'pointer', fontWeight:700 }}>Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background: toast.type==='success' ? '#059669' : '#B91C1C', color:'#fff', padding:'0.8rem 1.2rem', borderRadius:'0.8rem', boxShadow:'0 2px 12px #00000033', zIndex:1200, minWidth:'240px', textAlign:'center' }}>
          {toast.message}
        </div>
      )}
    </>
  );
}
