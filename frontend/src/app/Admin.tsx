import React from "react";
import Header from "../components/navbar/Header";

export default function Admin() {
  const [open, setOpen] = React.useState(false);
  const [openCategories, setOpenCategories] = React.useState(false);
  const [categories, setCategories] = React.useState<{ id: number; name: string; slug: string }[]>([]);
  const [newCategory, setNewCategory] = React.useState({ name: "", slug: "" });
  const [productForm, setProductForm] = React.useState({ title: "", price: "", category_id: "", description: "", sku: "", stock: "", slug: "", imageUrl: "" });

  React.useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);
  return (
    <>
          <div style={{ padding: '2rem', width: '100vw', minHeight: '100vh', background: 'linear-gradient(135deg, #0A1833 0%, #1769FA 100%)' }}>

      <Header />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F9FAFB', marginBottom: '2rem' }}>Admin Dashboard</h1>

        {/* Add Product & Categories Buttons */}
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: '1.2rem',
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            border: 'none',
            boxShadow: '0 2px 12px #1769FA44',
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'block'
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
            borderRadius: '1.2rem',
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            border: 'none',
            boxShadow: '0 2px 12px #7C3AED44',
            cursor: 'pointer',
            marginBottom: '2rem',
            marginLeft: '1rem',
            display: 'inline-block'
          }}
        >
          Categories
        </button>

        {/* Add Product Dialog */}
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
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>Add Product</h2>
              <form
                onSubmit={async (e) => {
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
                  const res = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                  });
                  if (res.ok) {
                    setOpen(false);
                    setProductForm({ title: '', price: '', category_id: '', description: '', sku: '', stock: '', slug: '', imageUrl: '' });
                    alert('Product added');
                  } else {
                    const text = await res.text();
                    try {
                      const data = JSON.parse(text);
                      alert(data.error || `Failed to add product (status ${res.status})`);
                    } catch {
                      alert(text || `Failed to add product (status ${res.status})`);
                    }
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
              >
                <input value={productForm.title} onChange={(e)=>setProductForm({...productForm,title:e.target.value})} type="text" placeholder="Title" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <input value={productForm.slug} onChange={(e)=>setProductForm({...productForm,slug:e.target.value})} type="text" placeholder="Slug" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <textarea value={productForm.description} onChange={(e)=>setProductForm({...productForm,description:e.target.value})} placeholder="Description" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <input value={productForm.price} onChange={(e)=>setProductForm({...productForm,price:e.target.value})} type="number" step="0.01" placeholder="Price" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <input value={productForm.sku} onChange={(e)=>setProductForm({...productForm,sku:e.target.value})} type="text" placeholder="SKU" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <input value={productForm.stock} onChange={(e)=>setProductForm({...productForm,stock:e.target.value})} type="number" placeholder="Stock" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <select value={productForm.category_id} onChange={(e)=>setProductForm({...productForm,category_id:e.target.value})} style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }}>
                  <option value="">Select Category</option>
                  {categories.map((c)=> (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <input value={productForm.imageUrl} onChange={(e)=>setProductForm({...productForm,imageUrl:e.target.value})} type="text" placeholder="Image URL" style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <button type="submit" style={{ background: 'linear-gradient(90deg, #1769FA 0%, #2563EB 100%)', color: '#fff', fontWeight: 700, borderRadius: '1rem', padding: '0.7rem 1.5rem', border: 'none', boxShadow: '0 2px 8px #1769FA44', cursor: 'pointer' }}>Add Product</button>
              </form>
              <button
                onClick={() => setOpen(false)}
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
                <input value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory, name:e.target.value})} placeholder="Name" style={{ padding: '0.6rem', borderRadius: '0.8rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
                <input value={newCategory.slug} onChange={(e)=>setNewCategory({...newCategory, slug:e.target.value})} placeholder="Slug" style={{ padding: '0.6rem', borderRadius: '0.8rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} />
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

        {/* Statistics Section */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Total Products</h2>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>123</div>
          </div>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Best Seller</h2>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Pro Design Template</div>
            <div style={{ color: '#1769FA', fontWeight: 600 }}>Sold: 54</div>
          </div>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Other Stats</h2>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>Total Sales: $1,230</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>Active Categories: 4</div>
          </div>
        </div>

        {/* Product Management Section */}
        <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 2px 12px #1769FA44', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.2rem' }}>Manage Products</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Product List Table */}
            <div style={{ flex: 2, minWidth: '320px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: '#1769FA', color: '#fff' }}>
                    <th style={{ padding: '0.7rem', borderRadius: '0.5rem 0 0 0.5rem' }}>Name</th>
                    <th style={{ padding: '0.7rem' }}>Price</th>
                    <th style={{ padding: '0.7rem' }}>Category</th>
                    <th style={{ padding: '0.7rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example product row */}
                  <tr style={{ background: '#23272F', color: '#F9FAFB' }}>
                    <td style={{ padding: '0.7rem' }}>Pro Design Template</td>
                    <td style={{ padding: '0.7rem' }}>$19</td>
                    <td style={{ padding: '0.7rem' }}>Templates</td>
                    <td style={{ padding: '0.7rem' }}>
                      <button style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.4rem 1rem', marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                      <button style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '0.7rem', padding: '0.4rem 1rem', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                  {/* Add more product rows here */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
