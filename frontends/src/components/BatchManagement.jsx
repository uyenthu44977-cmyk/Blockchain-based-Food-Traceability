import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function BatchManagement() {
  const { contract, address } = useWeb3();

  // ==========================================
  // LOGIC STATES - GIỮ NGUYÊN 100% TỪ CODE GỐC
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [myBatches, setMyBatches] = useState([]);

  const [formData, setFormData] = useState({
    batchCode: "",
    durianType: 0,
    origin: "",
    plantingAreaCode: "",
    packingHouseCode: "",
    exportMarket: "",
    certHash: "",
    certType: "",
    quantity: ""
  });

  const [statusBatchId, setStatusBatchId] = useState("");
  const [packedBatchId, setPackedBatchId] = useState("");

  const [transportData, setTransportData] = useState({
    batchId: "",
    location: "",
    temperature: ""
  });

  const [recallData, setRecallData] = useState({
    batchId: "",
    reason: ""
  });

  // ==========================================
  // HANDLERS & LOGIC FUNCTIONS - GIỮ NGUYÊN
  // ==========================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTransportChange = (e) => {
    setTransportData({ ...transportData, [e.target.name]: e.target.value });
  };

  const handleRecallChange = (e) => {
    setRecallData({ ...recallData, [e.target.name]: e.target.value });
  };

  const loadMyBatches = async () => {
    try {
      const result = await contract.getFarmerBatches(address);
      setMyBatches(result);
    } catch (error) {
      console.log(error);
    }
  };

  const createBatch = async () => {
    try {
      setLoading(true);
      const tx = await contract.createBatch(
        formData.batchCode,
        Number(formData.durianType),
        formData.origin,
        formData.plantingAreaCode,
        formData.packingHouseCode,
        formData.exportMarket,
        formData.certHash,
        formData.certType,
        Number(formData.quantity)
      );
      await tx.wait();
      alert("Tạo lô hàng thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setLoading(true);
      const tx = await contract.updateStatus(Number(statusBatchId), status);
      await tx.wait();
      alert("Cập nhật trạng thái thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const markPacked = async () => {
    try {
      setLoading(true);
      const tx = await contract.markPacked(Number(packedBatchId));
      await tx.wait();
      alert("Đóng gói thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTransport = async () => {
    try {
      setLoading(true);
      const tx = await contract.updateTransport(
        Number(transportData.batchId),
        transportData.location,
        Number(transportData.temperature)
      );
      await tx.wait();
      alert("Cập nhật vận chuyển thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const recallBatch = async () => {
    try {
      setLoading(true);
      const tx = await contract.recallBatch(Number(recallData.batchId), recallData.reason);
      await tx.wait();
      alert("Thu hồi thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GIAO DIỆN LỘT XÁC PHONG CÁCH CYBERPUNK
  // ==========================================
  return (
    <div style={styles.container}>
      {loading && <p style={styles.globalLoading}>Đang xử lý giao dịch dữ liệu lên Blockchain...</p>}

      {/* 1. DANH SÁCH BATCH */}
      <div style={styles.sectionBox}>
        <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_VANG }}>Danh sách batch</h3>
        <div style={styles.buttonGroupCenter}>
          <button onClick={loadMyBatches} style={{ ...styles.btn, ...styles.btnYellow, width: "180px" }}>
            Tải danh sách
          </button>
        </div>
        <div style={styles.batchGridContainer}>
          {myBatches.map((id) => (
            <div key={id.toString()} style={styles.batchCard}>
              <span style={{ color: "#a59cb0" }}>Batch ID:</span> <span style={styles.batchIdText}>{id.toString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TẠO LÔ HÀNG */}
      <div style={styles.sectionBox}>
        <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_XANH }}>Tạo lô hàng mới</h3>
        <div style={styles.inputGrid}>
          <input name="batchCode" placeholder="Batch Code" onChange={handleChange} style={styles.inputField} />
          <input name="origin" placeholder="Origin" onChange={handleChange} style={styles.inputField} />
          <input name="plantingAreaCode" placeholder="Planting Area" onChange={handleChange} style={styles.inputField} />
          <input name="packingHouseCode" placeholder="Packing House" onChange={handleChange} style={styles.inputField} />
          <input name="exportMarket" placeholder="Export Market" onChange={handleChange} style={styles.inputField} />
          <input name="certHash" placeholder="Cert Hash" onChange={handleChange} style={styles.inputField} />
          <input name="certType" placeholder="Cert Type" onChange={handleChange} style={styles.inputField} />
          <input name="quantity" placeholder="Quantity" onChange={handleChange} style={styles.inputField} />
          
          <select name="durianType" onChange={handleChange} style={styles.selectField}>
            <option value={0}>Ri6</option>
            <option value={1}>Monthong</option>
            <option value={2}>Musang King</option>
          </select>
        </div>
        <div style={styles.buttonGroupCenter}>
          <button onClick={createBatch} style={{ ...styles.btn, ...styles.btnGreen, width: "200px" }}>
            Create Batch
          </button>
        </div>
      </div>

      {/* 3. UPDATE STATUS */}
      <div style={styles.sectionBox}>
        <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_TIM }}>Update Status</h3>
        <div style={styles.singleActionRow}>
          <input
            placeholder="Nhập Batch ID"
            value={statusBatchId}
            onChange={(e) => setStatusBatchId(e.target.value)}
            style={{ ...styles.inputField, maxWidth: "300px", marginBottom: "0px" }}
          />
        </div>
        <div style={styles.buttonGroupCenter}>
          <button onClick={() => updateStatus(1)} style={{ ...styles.btn, ...styles.btnCyan }}>Harvested</button>
          <button onClick={() => updateStatus(2)} style={{ ...styles.btn, ...styles.btnCyan }}>Processing</button>
          <button onClick={() => updateStatus(4)} style={{ ...styles.btn, ...styles.btnCyan }}>Transporting</button>
          <button onClick={() => updateStatus(5)} style={{ ...styles.btn, ...styles.btnGreen }}>Delivered</button>
        </div>
      </div>

      {/* 4. MARK PACKED */}
      <div style={styles.sectionBox}>
        <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_HONG }}>Mark Packed</h3>
        <div style={styles.flexLayoutRow}>
          <input
            placeholder="Nhập Batch ID"
            value={packedBatchId}
            onChange={(e) => setPackedBatchId(e.target.value)}
            style={{ ...styles.inputField, flex: 2, marginBottom: "0px" }}
          />
          <button onClick={markPacked} style={{ ...styles.btn, ...styles.btnRed, flex: 1, minWidth: "150px" }}>
            Mark Packed
          </button>
        </div>
      </div>

      {/* 5. UPDATE TRANSPORT */}
      <div style={styles.sectionBox}>
        <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_XANH }}>Update Transport</h3>
        <div style={styles.inputGrid}>
          <input name="batchId" placeholder="Batch ID" onChange={handleTransportChange} style={styles.inputField} />
          <input name="location" placeholder="Location" onChange={handleTransportChange} style={styles.inputField} />
          <input name="temperature" placeholder="Temperature" onChange={handleTransportChange} style={styles.inputField} />
        </div>
        <div style={styles.buttonGroupCenter}>
          <button onClick={updateTransport} style={{ ...styles.btn, ...styles.btnCyan, width: "220px" }}>
            Update Transport
          </button>
        </div>
      </div>

      {/* 6. RECALL BATCH */}
      <div style={styles.sectionBox}>
        <h3 style={{ ...styles.sectionTitle, color: "#ff3b30" }}>Recall Batch (Thu hồi lô hàng)</h3>
        <div style={styles.inputGrid}>
          <input name="batchId" placeholder="Batch ID" onChange={handleRecallChange} style={styles.inputField} />
          <input name="reason" placeholder="Lý do thu hồi lô hàng..." onChange={handleRecallChange} style={styles.inputField} />
        </div>
        <div style={styles.buttonGroupCenter}>
          <button onClick={recallBatch} style={{ ...styles.btn, ...styles.btnWarning, width: "200px" }}>
            Recall Batch
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// HỆ THỐNG CONFIG CHUẨN TRUNG TÂM PHÁT SÁNG
// ==========================================
const styles = {
  M_NEON_XANH: "#f6f9f8",
  M_NEON_TIM: "#f9f5fb",
  M_NEON_HONG: "#fcfcfc",
  M_NEON_VANG: "#ffcc00",

  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    width: "100%",
    fontFamily: "'Smooch Sans', sans-serif",
  },
  globalLoading: {
    color: "#0033ff",
    fontSize: "22px",
    textShadow: "0 0 10px #f6f9f9",
    textAlign: "center",
    margin: "10px 0 20px 0",
  },
  // HỘP CHỨA VIỀN TÍM BO 
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
    marginBottom: "25px",
    textTransform: "uppercase",
    margin: "0 0 20px 0"
  },
  // CHIA LƯỚI 2 Ô INPUT TRÊN MỘT HÀNG TỰ ĐỘNG CÂN ĐỐI KHÔNG BỊ PHÌNH
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
    width: "100%"
  },
  singleActionRow: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    marginBottom: "15px"
  },
  flexLayoutRow: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap"
  },
  // THIẾT KẾ INPUT CĂN TÂM TUYỆT ĐỐI CHỐNG LÒI KHUNG
  inputField: {
    width: "100%",
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
    boxShadow: "inset 0 0 10px rgba(173, 34, 238, 0.2)",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",                   
    lineHeight: "normal",        
    paddingTop: "4px",
  },
  // THIẾT KẾ Ô SELECT KHUNG TRÒN VIÊN NHỘNG 
  selectField: {
    width: "100%",
    height: "46px",
    padding: "0px 20px",
    background: "#0d021a",
    border: "1px solid #efeaf2",         
    borderRadius: "50px",                
    color: "#ebf0ef",                       
    fontSize: "20px",                       
    outline: "none",
    fontFamily: "'Smooch Sans', sans-serif",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  buttonGroupCenter: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    marginTop: "15px"
  },
  // NÚT BẤM CĂN GIỮA TUYỆT ĐỐI, THU NHỎ GỌN THEO CHỮ 
  btn: {
    height: "45px",
    width: "fit-content",                  
    minWidth: "120px",
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
    lineHeight: "normal",                   
    paddingTop: "4px",
    paddingLeft: "25px",
    paddingRight: "25px"
  },
  // ĐỊNH NĂNG MÀU NEON CHO NÚT BẤM
  btnGreen: { color: "#79f485", border: "2px solid #79f485", background: "rgba(0, 255, 204, 0.05)" },
  btnCyan: { color: "#f1f6f8", border: "2px solid #f4f9fa", background: "rgba(0, 191, 255, 0.05)" },
  btnRed: { color: "#f7f4f5", border: "2px solid #faf4f6", background: "rgba(255, 0, 85, 0.05)" },
  btnYellow: { color: "#ffcc00", border: "2px solid #ffcc00", background: "rgba(255, 204, 0, 0.05)" },
  btnWarning: { color: "#f50808", border: "2px solid #f50f03", background: "rgba(255, 59, 48, 0.05)" },

  // CARD HIỂN THỊ DANH SÁCH BATCH ID 
  batchGridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "20px"
  },
  batchCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(173, 34, 238, 0.4)",
    borderRadius: "50px", // Biến thẻ hiển thị Batch ID thành viên nhộng dài luôn cho đẹp mắt
    padding: "10px 20px",
    fontSize: "18px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  batchIdText: {
    color: "#f5f8f7",
    fontWeight: "bold"
  }
};