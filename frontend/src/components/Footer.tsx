export default function Footer() {
  return (
    <footer style={{
      width: "100%",
      background: "#102040",
      color: "#F9FAFB",
      borderRadius: "1.5rem 1.5rem 0 0",
      padding: "2rem 2rem 1rem 2rem",
      marginTop: "3rem",
      boxShadow: "0 -2px 12px #1769FA44",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
        <a href="#" style={{ color: "#A3AAB8", textDecoration: "none" }}>Privacy</a>
        <a href="#" style={{ color: "#A3AAB8", textDecoration: "none" }}>Terms</a>
        <a href="#" style={{ color: "#A3AAB8", textDecoration: "none" }}>Help</a>
      </div>
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
        <a href="#" aria-label="Twitter" style={{ color: "#1769FA" }}>Twitter</a>
        <a href="#" aria-label="GitHub" style={{ color: "#1769FA" }}>GitHub</a>
        <a href="#" aria-label="LinkedIn" style={{ color: "#1769FA" }}>LinkedIn</a>
      </div>
      <div style={{ color: "#A3AAB8", fontSize: "0.95rem" }}>
        Contact: support@example.com
      </div>
      <div style={{ color: "#A3AAB8", fontSize: "0.9rem", marginTop: "0.7rem" }}>
        © 2025 YourStore. All rights reserved.
      </div>
    </footer>
  );
}
