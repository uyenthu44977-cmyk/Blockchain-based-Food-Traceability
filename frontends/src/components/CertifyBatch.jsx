import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function CertifyBatch() {
  const { contract } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [batchId, setBatchId] = useState("");
  
  // State lưu trữ thông tin lô hàng tìm được để hiển thị ảnh
  const [batchInfo, setBatchInfo] = useState(null);

  // 1. HÀM TRA CỨU LÔ HÀNG ĐỂ HIỂN THỊ ẢNH CHỨNG NHẬN
  const handleCheckBatch = async () => {
    if (!batchId.trim()) {
      alert("Vui lòng nhập Batch ID trước khi kiểm tra!");
      return;
    }
    if (!contract) {
      alert("Hệ thống chưa kết nối Smart Contract!");
      return;
    }

    try {
      setLoading(true);
      // Gọi hàm lấy thông tin struct lô hàng từ Smart Contract
      // Lưu ý: Đổi tên hàm 'getBatch' thành tên hàm tương ứng trong FoodTrace.sol nếu có
      const info = await contract.getBatch(batchId); 
      
      if (info && info.batchCode) {
        setBatchInfo({
          batchCode: info.batchCode,
          origin: info.origin,
          certHash: info.certHash, // Ký hiệu hoặc tên ảnh (Ví dụ: "monthong_certificate.jpg")
          certType: info.certType,
          quantity: info.quantity.toString()
        });
      } else {
        // Dự phòng nếu contract trả về mảng thay vì object map tên
        setBatchInfo({
          batchCode: info[0],
          origin: info[2],
          certHash: info[6], // Thường vị trí thứ 6 hoặc 7 tùy cấu trúc struct của bồ
          certType: info[7]
        });
      }
    } catch (error) {
      console.error(error);
      alert("Không tìm thấy thông tin lô hàng này hoặc lỗi truy vấn!");
      setBatchInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. HÀM KÝ CHỨNG NHẬN (CERTIFY)
  const handleCertify = async () => {
    if (!batchId.trim()) {
      alert("Nhập Batch ID");
      return;
    }
    if (!contract) {
      alert("Hệ thống chưa kết nối Smart Contract!");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.certifyBatch(batchId);      
      await tx.wait();
      alert("Chứng nhận lô hàng thành công! ✅");
      setBatchId("");
      setBatchInfo(null);
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {loading && <p style={styles.globalLoading}>🔄 Đang truy vấn dữ liệu Blockchain...</p>}

      <div style={styles.sectionBox}>
        <h3 style={styles.sectionTitle}>🛡️ Chứng nhận lô hàng</h3>
        
        <div style={styles.flexLayoutRow}>
          <input
            placeholder="Nhập Batch ID (Ví dụ: 1, 2, 3...)"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={styles.inputField}
          />
          
          {/* NÚT KIỂM TRA ĐỂ HIỆN ẢNH GIẤY CHỨNG NHẬN */}
          <button onClick={handleCheckBatch} style={styles.btnCyan}>
            🔍 Kiểm Tra Giấy Tờ
          </button>

          <button onClick={handleCertify} style={styles.btnGreen}>
            Certify Lô Hàng
          </button>
        </div>

        {/* ======================================================= */}
        {/* KHU VỰC THẦM ĐỊNH GIẤY CHỨNG NHẬN ĐỘC LẬP (XUẤT HIỆN KHI CÓ DATA) */}
        {/* ======================================================= */}
        {batchInfo && (
          <div style={styles.previewContainer}>
            <div style={styles.infoDetails}>
              <h4 style={{ color: "#00ffcc", margin: "0 0 10px 0" }}>📄 THÔNG TIN LÔ HÀNG GỐC</h4>
              <p><b>Mã Batch:</b> {batchInfo.batchCode}</p>
              <p><b>Nguồn gốc:</b> {batchInfo.origin}</p>
              <p><b>Loại chứng chỉ:</b> {batchInfo.certType}</p>
              <p><b>Mã băm chứng nhận:</b> {batchInfo.certHash}</p>
            </div>

            <div style={styles.imageWrapper}>
              <h4 style={{ color: "#ffcc00", margin: "0 0 10px 0", textAlign: "center" }}>
                📜 GIẤY CHỨNG NHẬN KHỚP VỚI BLOCKCHAIN
              </h4>
              
              {/* HIỂN THỊ FILE ẢNH CHỨNG NHẬN CỨNG HOẶC ĐỘNG TỪ NODEJS BACKEND */}
              <img 
                src="http://localhost:3000/uploads/monthong_certificate.jpg" 
                alt="VietGAP Certificate" 
                style={styles.certificateImage}
                onError={(e) => {
                  // Nếu không gọi được từ link backend api, sẽ fallback lấy ảnh tĩnh trong folder public frontend của bồ
                  e.target.onerror = null;
                  e.target.src = "/monthong_certificate.jpg"; 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// HỆ THỐNG CSS PHÁT SÁNG CYBERPUNK 
// ==========================================
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    width: "100%",
    fontFamily: "'Smooch Sans', sans-serif",
    marginTop: "20px"
  },
  globalLoading: {
    color: "#ffcc00",
    fontSize: "22px",
    textAlign: "center",
    margin: "10px 0",
    textShadow: "0 0 10px #ffcc00"
  },
  sectionBox: {
    background: "rgba(13, 2, 26, 0.6)",
    border: "2px solid #efeaf2", 
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 0 25px rgba(239, 231, 243, 0.15)",
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  sectionTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#ffcc00",
    margin: "0 0 25px 0"
  },
  flexLayoutRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  inputField: {
    flex: 2,
    minWidth: "220px",
    height: "46px",
    padding: "0px 20px",
    background: "rgba(13, 2, 26, 0.8)",
    border: "1px solid #efeaf2",         
    borderRadius: "50px",                
    color: "#ffffff",                       
    fontSize: "19px",                       
    outline: "none",
  },
  btnGreen: {
    flex: 1,
    minWidth: "150px",
    height: "45px",
    background: "rgba(0, 255, 204, 0.05)",
    borderRadius: "50px",                
    fontSize: "19px",                       
    fontWeight: "bold",
    cursor: "pointer",
    color: "#79f485", 
    border: "2px solid #79f485", 
    transition: "all 0.3s ease",
  },
  btnCyan: {
    flex: 1,
    minWidth: "150px",
    height: "45px",
    background: "rgba(0, 191, 255, 0.05)",
    borderRadius: "50px",                
    fontSize: "19px",                       
    fontWeight: "bold",
    cursor: "pointer",
    color: "#00bfff", 
    border: "2px solid #00bfff", 
    transition: "all 0.3s ease",
  },
  /* KHU VỰC PREVIEW CHỨNG CHỈ BIẾN HÌNH */
  previewContainer: {
    marginTop: "25px",
    paddingTop: "25px",
    borderTop: "1px dashed rgba(255, 255, 255, 0.2)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "20px",
    borderRadius: "16px"
  },
  infoDetails: {
    color: "#ffffff",
    fontSize: "18px",
    lineHeight: "1.8",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  certificateImage: {
    maxWidth: "100%",
    maxHeight: "380px",
    borderRadius: "12px",
    border: "3px solid #ffcc00",
    boxShadow: "0 0 20px rgba(255, 204, 0, 0.3)",
    objectFit: "contain",
    marginTop: "10px"
  }
};