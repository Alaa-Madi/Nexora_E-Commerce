

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useAuth from "../store/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const result = await register({ name, email, password });
      
      // Redirect based on role from the returned data
      if (result.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      // Error is handled by the auth store
      console.error('Register error:', err);
    }
  };

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
        {/* <Header /> */}
        
        {/* Hero Section */}
        <section
          style={{
            width: "100%",
            minHeight: "30vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0A1833 0%, #1769FA 100%)",
            color: "#F9FAFB",
            padding: "2rem",
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
              Join Us
            </span>
            <h1 style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              marginBottom: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-2px"
            }}>
              Sign <span style={{ color: "#1769FA" }}>Up</span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#A3AAB8", fontWeight: 500 }}>
              Create your account to start shopping
            </p>
          </div>
        </section>

        {/* Register Form */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh"
          }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                width: "100%",
                maxWidth: "400px",
                background: "#102040",
                borderRadius: "1.5rem",
                boxShadow: "0 2px 12px #1769FA44",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #23272F"
              }}
            >
              <motion.img 
                src="/vite.svg" 
                alt="Logo" 
                style={{ width: "64px", height: "64px", marginBottom: "1rem" }}
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }} 
                transition={{ duration: 0.5 }} 
              />
              <h2 style={{ 
                fontSize: "2rem", 
                fontWeight: 800, 
                color: "#F9FAFB", 
                marginBottom: "0.5rem",
                textAlign: "center"
              }}>
                Sign Up
              </h2>
              <p style={{ 
                color: "#A3AAB8", 
                marginBottom: "2rem", 
                textAlign: "center",
                fontSize: "1rem"
              }}>
                Create your account to get started.
              </p>
  <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative">
            <input
              type="text"
              id="register-name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="peer w-full px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#16224a] text-white placeholder-transparent"
              placeholder="Name"
              required
            />
            <label htmlFor="register-name" className="absolute left-4 top-2 text-blue-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-[#102040] px-1 pointer-events-none">Name</label>
          </div>
          <div className="relative">
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="peer w-full px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#16224a] text-white placeholder-transparent"
              placeholder="Email"
              required
            />
            <label htmlFor="register-email" className="absolute left-4 top-2 text-blue-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-[#102040] px-1 pointer-events-none">Email</label>
          </div>
          <div className="relative">
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="peer w-full px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#16224a] text-white placeholder-transparent"
              placeholder="Password"
              required
            />
            <label htmlFor="register-password" className="absolute left-4 top-2 text-blue-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-[#102040] px-1 pointer-events-none">Password</label>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-150"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            Register
          </motion.button>
          {error && <motion.div className="text-red-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
          {isLoading && <motion.div className="text-blue-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Creating account...</motion.div>}
        </form>
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <a 
                  href="/login" 
                  style={{ 
                    color: "#1769FA", 
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  Already have an account? Login
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* <Footer /> */}
      </main>
    </>
  );
}
