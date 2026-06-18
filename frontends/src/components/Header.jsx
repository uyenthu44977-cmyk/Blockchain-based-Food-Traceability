import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header
      style={{
        background: "rgba(239, 243, 245, 0.61)",
        color: "rgb(9, 81, 116)",
        fontFamily: "'Smooch Sans', sans-serif",
        padding: "10px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position:"relative",
        zIndex:10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: 40,
            filter: "drop-shadow(0 0 6px #18d72e)",
          }}
        />

        <h2 style={{ 
            margin: 0,
            fontSize: "18px",
            fontFamily: "'Smooch Sans', sans-serif"       
             }}>
          Blockchain Food Traceability
        </h2>
      </div>

      <Link
        to="/"
        style={{
          fontSize: "18px",
          color: "rgb(9, 81, 116)",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Trang chủ
      </Link>
    </header>
  );
}