import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    padding: "40px",
  }}
>

     <h1
  style={{
    fontSize: "110px",
    fontWeight: "400",
    fontFamily: "'Black Ops One', cursive",
    background: "linear-gradient(to right, #00d2ff, #7c4dff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px",
    letterSpacing: "2px",
    textShadow: "0 0 30px rgba(0,210,255,0.3)",
    lineHeight: "0.9",
  }}
>
  Blockchain
  <br />
  Food Traceability
</h1>

      <p
  style={{
    fontSize: "24px",
    fontStyle: "italic",
    fontFamily: "'Orbitron', smooch sans",
    letterSpacing: "1px",
  }}
>
  Hệ thống truy xuất nguồn gốc thực phẩm bằng blockchain
</p>

      <br />

     <h2 style={{ fontFamily: "'Smooch Sans', sans-serif", fontSize: "28px" }}>
  3 vấn đề chính:
</h2>

<ul
  style={{
    listStyle: "none",
    padding: 0,
    fontSize: "18px",
    lineHeight: "32px",
    fontFamily: "'Smooch Sans', sans-serif",
  }}
>
  <li>Hàng giả Organic/VietGAP</li>
  <li>Che giấu nhiệt độ vận chuyển</li>
  <li>Truy tìm lô lỗi chậm</li>
</ul>

      <br />

      <div
  style={{
    display: "flex",
    gap: "100px",
    marginTop: "70px",
  }}
>

 <Link to="/consumer">
  <button
    style={{
      padding: "20px 40px",
      fontSize: "30px",
      borderRadius: "16px",
      border: "1px solid rgba(126, 212, 231, 0.5)",
      background: "rgba(126, 212, 231, 0.1)",
      color: "#7ed4e7",
      fontFamily: "'Smooch Sans', sans-serif",
      cursor: "pointer",
      boxShadow: "0 0 15px rgba(126, 212, 231, 0.3)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    }}
    onMouseOver={(e) => {
      e.target.style.boxShadow = "0 0 25px rgba(126, 212, 231, 0.6)";
      e.target.style.transform = "translateY(-3px)";
    }}
    onMouseOut={(e) => {
      e.target.style.boxShadow = "0 0 15px rgba(126, 212, 231, 0.3)";
      e.target.style.transform = "translateY(0)";
    }}
  >
    Consumer Dashboard
  </button>
</Link>

  <Link to="/producer">
  <button
    style={{
      padding: "20px 40px",
      fontSize: "30px",
      borderRadius: "16px",
      border: "1px solid rgba(127, 85, 241, 0.5)",
      background: "rgba(127, 85, 241, 0.1)",
      color: "#a78bfa",
      fontFamily: "'Smooch Sans', sans-serif",
      cursor: "pointer",
      boxShadow: "0 0 15px rgba(127, 85, 241, 0.3)",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s ease",
    }}
    onMouseOver={(e) => {
      e.target.style.boxShadow = "0 0 25px rgba(127, 85, 241, 0.6)";
      e.target.style.transform = "translateY(-3px)";
    }}
    onMouseOut={(e) => {
      e.target.style.boxShadow = "0 0 15px rgba(127, 85, 241, 0.3)";
      e.target.style.transform = "translateY(0)";
    }}
  >
    Producer Dashboard
  </button>
</Link>

</div>

    </div>
  );
}