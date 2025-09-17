import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Home from "./app/Home";
import Products from "./app/Products";
import Cart from "./app/Cart";
import Checkout from "./app/Checkout";
import Login from "./app/Login";
import Register from "./app/Register";
import Orders from "./app/Orders";
import Admin from "./app/Admin";
import ProductDetails from "./app/ProductDetailes";
import Favorites from "./app/Favorites";
import CheckoutSuccess from "./app/CheckoutSuccess";
import CheckoutCancel from "./app/CheckoutCancel";
import NotFound from "./app/NotFound";
import Unauthorized from "./app/Unauthorized";
import Unauthenticated from "./app/Unauthenticated";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthInitializer from "./components/AuthInitializer";

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <AuthInitializer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={
            <ProtectedRoute requiredRole="user" showUnauthorized={true}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute requiredRole="user" showUnauthorized={true}>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute requiredRole="user" showUnauthorized={true}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/checkout/success" element={
            <ProtectedRoute requiredRole="user" showUnauthorized={true}>
              <CheckoutSuccess />
            </ProtectedRoute>
          } />
          <Route path="/checkout/cancel" element={
            <ProtectedRoute requiredRole="user" showUnauthorized={true}>
              <CheckoutCancel />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={
            <ProtectedRoute requiredRole="user" showUnauthorized={true}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/unauthenticated" element={<Unauthenticated />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
