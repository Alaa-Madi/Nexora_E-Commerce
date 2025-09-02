

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../store/useAuth";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const state = location.state as { email?: string; password?: string } | null;
    if (state?.email) setEmail(state.email);
    if (state?.password) setPassword(state.password);
  }, [location.state]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await login({ email, password });
      setSuccess("Login successful!");
      navigate("/");
      // Optionally save token: localStorage.setItem("token", data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
  className="w-full max-w-sm bg-[#102040] rounded-3xl shadow-2xl px-8 py-10 flex flex-col items-center border border-blue-900"
      >
        <motion.img src="/vite.svg" alt="Logo" className="w-16 h-16 mb-4" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Sign In</h1>
  <p className="text-blue-200 mb-8 text-center">Welcome back! Please login to your account.</p>
  <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative">
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="peer w-full px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#16224a] text-white placeholder-transparent"
              placeholder="Email"
              required
            />
            <label htmlFor="login-email" className="absolute left-4 top-2 text-blue-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-[#102040] px-1 pointer-events-none">Email</label>
          </div>
          <div className="relative">
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="peer w-full px-4 py-3 border border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#16224a] text-white placeholder-transparent"
              placeholder="Password"
              required
            />
            <label htmlFor="login-password" className="absolute left-4 top-2 text-blue-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-[#102040] px-1 pointer-events-none">Password</label>
          </div>
          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-150"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            Login
          </motion.button>
          {error && <motion.div className="text-red-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
          {success && <motion.div className="text-green-500 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{success}</motion.div>}
        </form>
        <div className="mt-8 text-center">
          <a href="/register" className="text-blue-400 hover:underline font-medium">Don't have an account? Register</a>
        </div>
      </motion.div>
    </div>
  );
}
