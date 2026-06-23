import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function CertifyBatch() {
  const { contract } = useWeb3();
  const [loading, setLoading] = useState(false);
  
  // State quản lý chuẩn xác dữ liệu nhập vào từ ô input
  const [batchId, setBatchId] = useState("");

  const handleCertify = async () => {
    // Kiểm tra và cắt bỏ khoảng trắng dư thừa
    if (!batchId.trim()) {
      alert("Nhập Batch ID");
      return;
    }

    try {
      setLoading(true);
      
      // TRUYỀN TRỰC TIẾP CHUỖI "SR2026201" - KHÔNG ÉP KIỂU NUMBER KHÊN BỊ NaN
      const tx = await contract.certifyBatch(batchId);      
      await tx.wait();
      
      alert("Chứng nhận lô hàng thành công!");
      setBatchId(""); // Xóa sạch ô nhập sau khi thành công
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {loading && <p style={styles.globalLoading}>Đang xác thực chứng nhận lên Blockchain...</p>}

      <div style={styles.sectionBox}>
        <h3 style={styles.sectionTitle}>Chứng nhận lô hàng</h3>
        
        <div style={styles.flexLayoutRow}>
          {/* Ô INPUT ĐÃ ĐƯỢC ĐỒNG BỘ VALUE VÀ ONCHANGE CHUẨN XÁC */}
          <input
            placeholder="Nhập Batch ID (Ví dụ: SR2026201)"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={styles.inputField}
          />
          
          <button onClick={handleCertify} style={styles.btn}>
            Certify
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HỆ THỐNG CSS VIÊN NHỘNG ĐỒNG BỘ ADMIN & FARMER
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
    color: "#0033ff",
    fontSize: "22px",
    textAlign: "center",
    margin: "10px 0",
  },
  sectionBox: {
    background: "rgba(13, 2, 26, 0.4)",
    border: "2px solid #f5f3f6", 
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 0 20px rgba(239, 231, 243, 0.2)",
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  sectionTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#f9f8f5", // Màu neon vàng rực rỡ
    margin: "0 0 25px 0"
  },
  flexLayoutRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap"
  },
  inputField: {
    flex: 2,
    minWidth: "250px",
    height: "46px",
    padding: "0px 20px",
    background: "rgba(13, 2, 26, 0.6)",
    border: "1px solid #efeaf2",         
    borderRadius: "50px",                
    color: "#ffffff",                       
    fontSize: "19px",                       
    outline: "none",
    fontFamily: "'Smooch Sans', sans-serif",
    letterSpacing: "1px",
    boxSizing: "border-box",
  },
  btn: {
    flex: 1,
    minWidth: "140px",
    height: "45px",
    background: "transparent",
    borderRadius: "50px",                
    fontSize: "20px",                       
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Smooch Sans', sans-serif",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    display: "inline-flex",
    justifyContent: "center",               
    alignItems: "center",                   
    color: "#79f485", // Viền xanh lá cyberpunk
    border: "2px solid #79f485", 
    background: "rgba(0, 255, 204, 0.05)"
  }
};