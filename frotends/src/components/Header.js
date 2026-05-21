import logo from "../logo.svg";

export default function Header() {
  return (
    <div
      style={{
        background: "#111",
        color: "white",
        fontFamily: "'Smooch Sans', sans-serif",
        padding: "15px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}
    >
      <img
  src={logo}
  alt="logo"
  style={{
    width: 40,
    filter: "drop-shadow(0 0 6px #00ffcc)"
  }}
/>

      <h2 style={{ margin: 0 }}>
        Food Traceability App
      </h2>
    </div>
  );
}