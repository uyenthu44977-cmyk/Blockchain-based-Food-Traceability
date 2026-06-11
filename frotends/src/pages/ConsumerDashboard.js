import { useState } from "react";
import SafetyResult from "../components/SafetyResult";
export default function ConsumerDashboard() {


  const [batchId, setBatchId] = useState("");


  const [result, setResult] = useState(null);


  const handleSearch = () => {


    if (batchId === "1") {
      setResult({
  status: "SAFE",
  color: "#607d51",
  product: "Cà phê Đắk Lắk",
  message: "Sản phẩm an toàn",


  origin: "Buôn Ma Thuột",


  harvestedAt: "10/05/2026",


  certifications: [
    "Organic",
    "VietGAP",
  ],


  image:
    "https://hrcoffee.vn/wp-content/uploads/2024/12/ca-phe-dak-lak-tinh-hoa-cao-nguyen-trong-tung-giot-dam-da-1.jpg",


  timeline: [
    {
      step: "Thu hoạch",
      location: "Đắk Lắk",
      time: "10/05/2026",
      temperature: "20°C",
    },


    {
      step: "Chế biến",
      location: "Nhà máy BMT",
      time: "11/05/2026",
      temperature: "22°C",
    },


    {
      step: "Vận chuyển",
      location: "TP.HCM",
      time: "12/05/2026",
      temperature: "21°C",
    },
  ],
});
    }


    else if (batchId === "2") {
  setResult({
    status: "WARNING",
    color: "orange",


    product: "Thịt bò sạch",


    message:
      "Nhiệt độ vận chuyển vượt ngưỡng",


    origin: "Đồng Nai",


    harvestedAt: "15/05/2026",


    certifications: [
      "VietGAP",
    ],


    image:
      "https://thanhnien.mediacdn.vn/Uploaded/minhnguyet/2015_10_21/thitbo_TNJU.jpg?width=500",


    timeline: [
      {
        step: "Thu hoạch",
        location: "Đồng Nai",
        time: "15/05/2026",
        temperature: "8°C",
      },


      {
        step: "Vận chuyển",
        location: "TP.HCM",
        time: "16/05/2026",
        temperature: "35°C",
      },
    ],
  });
}


    else if (batchId === "3") {
  setResult({
    status: "RECALLED",


    color: "red",


    product: "Rau muống",


    message:
      "Lô hàng bị thu hồi do nhiễm khuẩn E.coli",


    origin: "Lâm Đồng",


    harvestedAt: "20/05/2026",


    certifications: [
      "Organic",
    ],


    image:
      "https://hongngochospital.vn/wp-content/uploads/2013/11/rau-muong.jpg",


    timeline: [
      {
        step: "Thu hoạch",
        location: "Lâm Đồng",
        time: "20/05/2026",
        temperature: "18°C",
      },


      {
        step: "Kiểm nghiệm",
        location: "Kho kiểm định",
        time: "21/05/2026",
        temperature: "19°C",
      },


      {
        step: "Thu hồi",
        location: "TP.HCM",
        time: "22/05/2026",
        temperature: "N/A",
      },
    ],
  });
}


    else {
      setResult({
        status: "NOT FOUND",
        color: "gray",
        product: "",
        message: "Không tìm thấy lô hàng",
      });
    }
  };


  return (
    <div
  style={{
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
  }}
>


      <h1
  style={{
    fontFamily: "'Smooch Sans', sans-serif",
    fontSize: "55px",
    fontWeight: "700",


    background:
      "linear-gradient(90deg, #00d2ff, #7c4dff, #ff4fd8, #00d2ff)",


    backgroundSize: "300%",


    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",


    animation: "gradientMove 5s ease infinite",
  }}
>
  Consumer Dashboard
</h1>


      <input
  type="text"
  placeholder="Nhập Batch ID"
  value={batchId}
  onChange={(e) => setBatchId(e.target.value)}
  style={{
    padding: "10px",
    width: "300px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    fontFamily: "'Nunito', sans-serif",
    color: "white",
    outline: "none",
  }}
/>


      <br />


      <button
  onClick={handleSearch}
  style={{
    fontFamily: "'Nunito', sans-serif",
    fontSize: "15px",


    padding: "5px 25px",


    borderRadius: "20px",
    border: "none",


    background:
      "linear-gradient(to right, #00d2ff, #7c4dff)",


    color: "white",


    cursor: "pointer",


    boxShadow:
      "0 0 15px rgba(124,77,255,0.4)",


    transition: "0.5s",
  }}
>
  Tra cứu
</button>
      <br />
      <br />


      <SafetyResult result={result} />


    </div>
  );
}

