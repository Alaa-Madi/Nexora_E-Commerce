import React from "react";
import Header from "../components/navbar/Header";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function Admin() {
  const [openNewAdmin, setOpenNewAdmin] = React.useState(false);
  const [adminForm, setAdminForm] = React.useState({ name: "", email: "", password: "" });
  const [summary, setSummary] = React.useState<{ totalProducts: number; totalCategories: number; totalOrders: number; totalRevenue: number } | null>(null);
  const [productSales, setProductSales] = React.useState<{ product_title: string; totalSold: string | number }[]>([]);
  const [categoryCounts, setCategoryCounts] = React.useState<{ id: number; name: string; productCount: string | number }[]>([]);

  React.useEffect(() => {
    // Load admin stats
    fetch('http://localhost:5000/api/admin/stats/summary')
      .then(r=>r.ok?r.json():Promise.reject())
      .then((data)=> setSummary(typeof data==='object' && data? data : null))
      .catch(()=> setSummary(null));

    fetch('http://localhost:5000/api/admin/stats/product-sales')
      .then(r=>r.ok?r.json():Promise.reject())
      .then((rows)=> setProductSales(Array.isArray(rows)? rows : []))
      .catch(()=> setProductSales([]));

    fetch('http://localhost:5000/api/admin/stats/category-products')
      .then(r=>r.ok?r.json():Promise.reject())
      .then((rows)=> setCategoryCounts(Array.isArray(rows)? rows : []))
      .catch(()=> setCategoryCounts([]));
  }, []);

  return (
    <>
          <div style={{ padding: '2rem', width: '100vw', minHeight: '100vh', background: 'linear-gradient(135deg, #0A1833 0%, #1769FA 100%)' }}>

      <Header />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F9FAFB', marginBottom: '2rem' }}>Admin Dashboard</h1>

        {/* New Admin Button */}
        <button
          onClick={() => setOpenNewAdmin(true)}
          style={{
            background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
            color: '#fff',
            fontWeight: 700,
            borderRadius: '1.2rem',
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            border: 'none',
            boxShadow: '0 2px 12px #10B98144',
            cursor: 'pointer',
            marginBottom: '2rem',
            display: 'block'
          }}
        >
          New Admin
        </button>

        {/* New Admin Dialog */}
        {openNewAdmin && (
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
              boxShadow: '0 2px 24px #10B98144',
              padding: '2.5rem 3rem',
              minWidth: '480px',
              maxWidth: '500px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>Add New Admin</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const body = {
                    name: adminForm.name,
                    email: adminForm.email,
                    password: adminForm.password,
                    role: 'admin'
                  };
                  const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                  });
                  if (res.ok) {
                    setOpenNewAdmin(false);
                    setAdminForm({ name: '', email: '', password: '' });
                    alert('Admin added successfully');
                  } else {
                    const text = await res.text();
                    try {
                      const data = JSON.parse(text);
                      alert(data.error || `Failed to add admin (status ${res.status})`);
                    } catch {
                      alert(text || `Failed to add admin (status ${res.status})`);
                    }
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
              >
                <input 
                  value={adminForm.name} 
                  onChange={(e)=>setAdminForm({...adminForm,name:e.target.value})} 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} 
                />
                <input 
                  value={adminForm.email} 
                  onChange={(e)=>setAdminForm({...adminForm,email:e.target.value})} 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} 
                />
                <input 
                  value={adminForm.password} 
                  onChange={(e)=>setAdminForm({...adminForm,password:e.target.value})} 
                  type="password" 
                  placeholder="Password" 
                  required
                  style={{ padding: '0.7rem', borderRadius: '1rem', border: 'none', fontSize: '1rem', background:'#16224a', color:'#F9FAFB' }} 
                />
                <button 
                  type="submit" 
                  style={{ 
                    background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)', 
                    color: '#fff', 
                    fontWeight: 700, 
                    borderRadius: '1rem', 
                    padding: '0.7rem 1.5rem', 
                    border: 'none', 
                    boxShadow: '0 2px 8px #10B98144', 
                    cursor: 'pointer' 
                  }}
                >
                  Add Admin
                </button>
              </form>
              <button
                onClick={() => setOpenNewAdmin(false)}
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

        {/* Statistics Section */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Total Products</h2>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{summary?.totalProducts ?? '-'}</div>
          </div>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Total Categories</h2>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{summary?.totalCategories ?? '-'}</div>
          </div>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Total Orders</h2>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{summary?.totalOrders ?? '-'}</div>
          </div>
          <div style={{ background: '#102040', color: '#F9FAFB', borderRadius: '1.5rem', padding: '2rem', minWidth: '220px', boxShadow: '0 2px 12px #1769FA44', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.7rem' }}>Total Revenue</h2>
            <div style={{ fontSize: '2rem', fontWeight: 900 }}>${summary?.totalRevenue?.toLocaleString?.() ?? '-'}</div>
          </div>
        </div>

        {/* Charts with Recharts */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(380px, 1fr))', gap:'2rem', marginBottom:'2.5rem' }}>
          {/* Product Sales - Horizontal Bar Chart */}
          <div style={{ background:'#102040', color:'#F9FAFB', borderRadius:'1.5rem', padding:'1.5rem', boxShadow:'0 2px 12px #1769FA44', minHeight: 400 }}>
            <h3 style={{ marginBottom:'1rem', fontSize:'1.2rem', fontWeight:700 }}>Product Sales</h3>
            <div style={{ width:'100%', height:350 }}>
              <ResponsiveContainer>
                <BarChart 
                  data={(Array.isArray(productSales)?productSales:[]).slice(0,10).map(r=>({ 
                    name: r.product_title.length > 15 ? r.product_title.substring(0,15)+'...' : r.product_title, 
                    value: Number(r.totalSold||0),
                    fullName: r.product_title
                  }))}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#1F2A44" strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fill:'#A3AAB8', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill:'#A3AAB8', fontSize: 11 }} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      background:'#0B1428', 
                      border:'1px solid #1F2A44', 
                      color:'#F9FAFB',
                      borderRadius:'8px'
                    }} 
                    formatter={(value: any, name: any, props: any) => [
                      `${value} sold`, 
                      props.payload.fullName
                    ]}
                  />
                  <Bar dataKey="value" fill="#1769FA" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories - TinyBarChart */}
          <div style={{ background:'#102040', color:'#F9FAFB', borderRadius:'1.5rem', padding:'1.5rem', boxShadow:'0 2px 12px #1769FA44', minHeight: 400 }}>
            <h3 style={{ marginBottom:'1rem', fontSize:'1.2rem', fontWeight:700 }}>Products per Category</h3>
            <div style={{ width:'100%', height:350 }}>
              <ResponsiveContainer>
                <BarChart 
                  data={(Array.isArray(categoryCounts)?categoryCounts:[]).map((r, index)=>({ 
                    name: r.name.length > 8 ? r.name.substring(0,8)+'...' : r.name, 
                    value: Number((r as any).productCount||0),
                    fullName: r.name
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid stroke="#1F2A44" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill:'#A3AAB8', fontSize: 11 }} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill:'#A3AAB8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background:'#0B1428', 
                      border:'1px solid #1F2A44', 
                      color:'#F9FAFB',
                      borderRadius:'8px'
                    }} 
                    formatter={(value: any, name: any, props: any) => [
                      `${value} products`, 
                      props.payload.fullName
                    ]}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {(Array.isArray(categoryCounts)?categoryCounts:[]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10B981', '#059669', '#047857', '#065f46', '#064e3b'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
