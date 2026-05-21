export default function SafetyResult({ result }) {

  if (!result) return null;

  return (
    <div
      style={{
  marginTop: "30px",
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  fontFamily: "'Space Grotesk', Times New Roman",
  color:
  result.status === "SAFE"
    ? "#16b462"
    : result.status === "WARNING"
    ? "#FDFD96"
    : result.status === "RECALLED"
    ? "#c84e4e"
    : "#cfcfcf",
  width: "600px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
}}
    >

      <h1>{result.product}</h1>

      <h2>
        Trạng thái: {result.status}
      </h2>

      <p>
        {result.message}
      </p>

      <hr />

      <h3>Thông tin cơ bản</h3>

      <p>
        <b>Nguồn gốc:</b> {result.origin}
      </p>

      <p>
        <b>Thu hoạch:</b> {result.harvestedAt}
      </p>

      <hr />

      <h3>Lịch sử hành trình</h3>

      {result.timeline.map((item, index) => (
        <div
          key={index}
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgb(255, 255, 255)",
            border: `1px solid ${result.glow}`,
            boxShadow: `0 0 20px ${result.glow}`,
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <p>
            <b>{item.step}</b>
          </p>

          <p>
            📍 {item.location}
          </p>

          <p>
            🕒 {item.time}
          </p>

          <p>
            🌡 {item.temperature}
          </p>
        </div>
      ))}

      <hr />

      <h3>Chứng nhận</h3>

      <ul>
        {result.certifications.map((cert, index) => (
          <li key={index}>
            {cert}
          </li>
        ))}
      </ul>

      <hr />

      <h3>Hình ảnh sản phẩm</h3>

      <img
        src={result.image}
        alt="product"
        width="250"
        style={{
          borderRadius: "10px",
        }}
      />

    </div>
  );
}