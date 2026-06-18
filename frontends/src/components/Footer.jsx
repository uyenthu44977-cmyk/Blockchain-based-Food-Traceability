export default function Footer() {
  return (
    <footer
      style={{
        background: "rgba(249, 250, 251, 0.7)",
        color: "rgb(9, 81, 116)",
        fontFamily: "'Smooch Sans', sans-serif",
        padding: "15px",
        textAlign: "center",
        borderTop: "1px solid #1f2937",
        position:"relative",
        zindex: 10,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          letterSpacing: "1px",
        }}
      >
        © 2026 Blockchain Food Traceability
      </p>
    </footer>
  );
}