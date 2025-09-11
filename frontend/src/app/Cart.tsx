
import Header from "../components/navbar/Header";
import Footer from "../components/Footer";
import useCart from "../store/useCart";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();

  return (
    <>
      <main className="w-full mx-auto px-4 py-8">
      <Header />
        
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
              Shopping Cart
            </span>
            <h1 style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              marginBottom: "1.2rem",
              lineHeight: 1.1,
              letterSpacing: "-2px"
            }}>
              Your <span style={{ color: "#1769FA" }}>Cart</span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: "#A3AAB8", fontWeight: 500 }}>
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} • ${getTotalPrice().toFixed(2)} total
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ 
            background: "#102040", 
            borderRadius: "1.5rem", 
            padding: "2rem", 
            boxShadow: "0 2px 12px #1769FA44" 
          }}>
            {items.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "3rem", 
                color: "#A3AAB8" 
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Your cart is empty</div>
                <div style={{ fontSize: "1rem", opacity: 0.7, marginBottom: "2rem" }}>Add some products to get started!</div>
                <a 
                  href="/products"
                  style={{
                    background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    borderRadius: "1rem",
                    padding: "0.8rem 2rem",
                    textDecoration: "none",
                    display: "inline-block",
                    boxShadow: "0 2px 8px #1769FA44"
                  }}
                >
                  Browse Products
                </a>
              </div>
            ) : (
              <>
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
                    Cart Items
                  </h2>
                  <button
                    onClick={clearCart}
                    style={{
                      background: "#7C3AED",
                      color: "#fff",
                      border: "none",
                      borderRadius: "0.8rem",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Clear Cart
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {items.map((item) => (
                    <div key={item.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                      background: "#16224a",
                      borderRadius: "1rem",
                      padding: "1.5rem",
                      border: "1px solid #23272F"
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        style={{ 
                          width: "80px", 
                          height: "80px", 
                          borderRadius: "0.8rem",
                          objectFit: "cover"
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: "1.2rem", 
                          fontWeight: 700, 
                          color: "#F9FAFB",
                          marginBottom: "0.5rem"
                        }}>
                          {item.title}
                        </h3>
                        <div style={{ color: "#1769FA", fontSize: "1.1rem", fontWeight: 600 }}>
                          ${item.price}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: "#23272F",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.5rem",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          -
                        </button>
                        <span style={{ 
                          color: "#F9FAFB", 
                          fontSize: "1.1rem", 
                          fontWeight: 600,
                          minWidth: "30px",
                          textAlign: "center"
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: "#23272F",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.5rem",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ 
                        color: "#F9FAFB", 
                        fontSize: "1.2rem", 
                        fontWeight: 700,
                        minWidth: "80px",
                        textAlign: "right"
                      }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: "#DC2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  background: "#16224a",
                  borderRadius: "1rem",
                  border: "1px solid #23272F"
                }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "1rem"
                  }}>
                    <span style={{ fontSize: "1.2rem", color: "#A3AAB8" }}>Total Items:</span>
                    <span style={{ fontSize: "1.2rem", color: "#F9FAFB", fontWeight: 600 }}>{getTotalItems()}</span>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginBottom: "1.5rem"
                  }}>
                    <span style={{ fontSize: "1.4rem", color: "#F9FAFB", fontWeight: 700 }}>Total Price:</span>
                    <span style={{ fontSize: "1.4rem", color: "#1769FA", fontWeight: 700 }}>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <a 
                    href="/checkout"
                    style={{
                      background: "linear-gradient(90deg, #1769FA 0%, #2563EB 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: "1rem",
                      padding: "1rem 2rem",
                      textDecoration: "none",
                      display: "block",
                      textAlign: "center",
                      boxShadow: "0 2px 8px #1769FA44",
                      fontSize: "1.1rem"
                    }}
                  >
                    Proceed to Checkout
                  </a>
                </div>
              </>
            )}
      </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
