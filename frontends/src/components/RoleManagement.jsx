import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function RoleManagement() {
  const { contract } = useWeb3();

  // ==========================================
  // STATE GIỮ NGUYÊN TỪ CODE GỐC CỦA BẠN
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [farmerAddress, setFarmerAddress] = useState("");
  const [farmName, setFarmName] = useState("");
  const [inspectorAddress, setInspectorAddress] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [farms, setFarms] = useState([]);

  // ==========================================
  // LOGIC FUNCTIONS GIỮ NGUYÊN TOÀN BỘ
  // ==========================================
  const addFarm = async () => {
    try {
      if (!farmerAddress || !farmName) {
        alert("Nhập đầy đủ thông tin");
        return;
      }
      setLoading(true);
      const tx = await contract.addFarm(farmerAddress, farmName);
      await tx.wait();
      alert("Thêm Farmer thành công");
      setFarmerAddress("");
      setFarmName("");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFarm = async () => {
    try {
      if (!farmerAddress) {
        alert("Nhập địa chỉ Farmer");
        return;
      }
      setLoading(true);
      const tx = await contract.removeFarm(farmerAddress);
      await tx.wait();
      alert("Xóa Farmer thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addInspector = async () => {
    try {
      if (!inspectorAddress) {
        alert("Nhập địa chỉ Inspector");
        return;
      }
      setLoading(true);
      const tx = await contract.addInspector(inspectorAddress);
      await tx.wait();
      alert("Thêm Inspector thành công");
      setInspectorAddress("");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeInspector = async () => {
    try {
      if (!inspectorAddress) {
        alert("Nhập địa chỉ Inspector");
        return;
      }
      setLoading(true);
      const tx = await contract.removeInspector(inspectorAddress);
      await tx.wait();
      alert("Xóa Inspector thành công");
    } catch (error) {
      alert(error.reason || error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFarms = async () => {
    try {
      setLoading(true);
      const addresses = await contract.getAllFarms();
      const farmData = await Promise.all(
        addresses.map(async (addr) => {
          const info = await contract.getFarmInfo(addr);
          return {
            address: addr,
            name: info[0],
            verified: info[1],
          };
        })
      );
      setFarms(farmData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GIAO DIỆN ĐƯỢC BUILD MỚI (CYBERPUNK NEON)
  // ==========================================
  return (
    <div style={styles.container}>
      {loading && <p style={styles.globalLoading}>🔄 Hệ thống đang xử lý giao dịch trên Blockchain...</p>}

      {/* BLOCK QUẢN LÝ FARMER */}
      <div style={styles.subSection}>
        <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_TIM }}> QUẢN LÝ FARMER</h3>
        <div style={styles.inputLayout}>
          <input
            placeholder="Địa chỉ ví Farmer (0x...)"
            value={farmerAddress}
            onChange={(e) => setFarmerAddress(e.target.value)}
            style={styles.inputField}
          />
          <input
            placeholder="Tên trang trại sầu riêng"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            style={styles.inputField}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={addFarm} style={{ ...styles.btn, ...styles.btnGreen }}>Add Farm</button>
          <button onClick={removeFarm} style={{ ...styles.btn, ...styles.btnRed }}>Remove Farm</button>
        </div>
      </div>

      <div style={styles.divider}></div>

{/* BLOCK QUẢN LÝ INSPECTOR */}
<div style={styles.subSection}>
  <h3 style={{ ...styles.sectionTitle, color: styles.M_NEON_XANH }}>
    QUẢN LÝ INSPECTOR
  </h3>

  <div style={styles.inputLayout}>
    <input
      placeholder="Địa chỉ ví Inspector (0x...)"
      value={inspectorAddress}
      onChange={(e) => setInspectorAddress(e.target.value)}
      style={styles.inputField}
    />
    <input
            placeholder="Tên thanh tra"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            style={styles.inputField}
          />
  </div>

  <div style={styles.buttonGroup}>
    <button onClick={addInspector} style={{ ...styles.btn, ...styles.btnCyan }}>
      Add Inspector
    </button>
    <button onClick={removeInspector} style={{ ...styles.btn, ...styles.btnRed }}>
      Remove Inspector
    </button>
  </div>
</div>

      <div style={styles.divider}></div>

      {/* BLOCK DANH SÁCH TRANG TRẠI */}
      <div style={styles.subSection}>
        <h3 style={{ ...styles.sectionTitle, color: "#ffcc00" }}>DANH SÁCH TRANG TRẠI</h3>
        <button onClick={loadFarms} style={{ ...styles.btn, ...styles.btnYellow, width: "100%", marginBottom: "20px" }}>
          Tải dữ liệu / Xem tất cả Farm
        </button>

        <div style={styles.gridContainer}>
          {farms.map((farm, index) => (
            <div key={index} style={styles.farmCard}>
              <p style={styles.cardText}><b>Tên:</b> <span style={{ color: "#fff" }}>{farm.name}</span></p>
              <p style={styles.cardText}><b>Ví:</b> <span style={styles.cardAddress}>{farm.address}</span></p>
              <p style={styles.cardText}>
                <b>Trạng thái:</b>{" "}
                <span style={farm.verified ? styles.statusVerified : styles.statusUnverified}>
                  {farm.verified ? "● Đã xác thực" : "○ Chưa xác thực"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TRUNG TÂM PHÂN PHỐI STYLE (ĐỂ BẠN TỰ SỬA BIẾN)
// ==========================================
const styles = {
  // CÁC THÔNG SỐ CONFIG ĐỂ ĐIỀU CHỈNH NHANH
  BO_GOC_TRON: "50px",       // Cấu hình bo góc tròn viên nhộng cho toàn bộ Nút và Ô điền (Input)
  BO_GOC_CARD: "16px",       // Cấu hình bo góc thẻ card hiển thị danh sách farm
  M_NEON_XANH: "#00ffcc",
  M_NEON_TIM: "#ad22ee",
  M_NEON_HONG: "#ff0055",
  M_NEON_VANG: "#ffcc00",

  container: {
    fontFamily: "'Smooch Sans', sans-serif",
  },
  globalLoading: {
    color: "#0ff0c3",
    fontSize: "22px",
    textShadow: "0 0 10px #00ffcc",
    marginBottom: "20px",
    textAlign: "center",
  },
  subSection: {
    textAlign: "left",
    marginBottom: "15px",
  },
  sectionTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    letterSpacing: "1.5px",
    marginBottom: "20px",
    textTransform: "uppercase",
  },
  inputLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },

  buttonGroup: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px",
    justifyContent: "center",
  },
  
  // ========================================================
  // THIẾT KẾ CÁC Ô ĐIỀN THÔNG TIN (INPUT) - CHUẨN KHÔNG BỊ TRÀN KHUNG
  // ========================================================
  inputField: {
    width: "100%",
    height: "50px",                         // Cố định chiều cao
    padding: "0px 20px",                    // Padding trái phải để chữ không dính sát viền tròn
    background: "rgba(13, 2, 26, 0.6)",
    border: "1px solid #efeaf2",          // Viền màu tím mặc định  
    borderRadius: "50px",                   // BO TRÒN VIÊN NHỘNG CHO INPUT
    color: "#ffffffc5",                       
    fontSize: "20px",                       
    outline: "none",
    fontFamily: "'Smooch Sans', sans-serif",
    letterSpacing: "1px",
    boxShadow: "inset 0 0 10px rgba(173, 34, 238, 0.2)",
    marginBottom: "10px",

    // THUỘC TÍNH CHỐNG LÒI KHỎI BẢNG (RẤT QUAN TRỌNG) ----
    boxSizing: "border-box",                // Ép kích thước luôn nằm gọn bên trong khung bọc
    
    // CĂN GIỮA CHỮ THEO CHIỀU DỌC ----
    display: "flex",
    alignItems: "center",                   
    lineHeight: "normal",        
    paddingTop: "4px",                      // Ghì chữ Smooch Sans xuống một chút cho chuẩn tâm
  },

  // THIẾT KẾ NÚT BẤM (BUTTON) - CÂN ĐỐI KHÔNG BỊ PHÌNH TO ----
  btn: {
    width: "200px",                         // ĐỘ RỘNG NÚT BẤM: Bạn có thể chỉnh 150px hoặc 180px tùy ý
    height: "45px",                         // CHIỀU CAO NÚT BẤM: Giảm từ 50px xuống 45px cho nhỏ gọn hơn    minWidth: "100px",
    background: "transparent",
    borderRadius: "50px",                
    fontSize: "20px",                       
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "'Smooch Sans', sans-serif",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    border: "1px solid #fff",

    // THUỘC TÍNH CHỐNG LÒI KHỎI BẢNG ----
    boxSizing: "border-box",                
    padding: "0px 10px",                    // Đổi lại padding gọn gàng

    // CĂN GIỮA CHỮ TUYỆT ĐỐI ----
    display: "inline-flex",
    justifyContent: "center",               
    alignItems: "center",                   
    lineHeight: "normal",                   
    paddingTop: "4px",                      
  },

  // ĐỔI MÀU CHO TỪNG LOẠI NÚT THEO TÔNG NEON 
  btnGreen: {
    color: "#79f485",
    border: "2px solid #79f485",
    boxShadow: "0 0 15px rgba(17, 255, 0, 0.2)",

  },
  btnCyan: {
    color: "#79f485",
    border: "2px solid #79f485",
    boxShadow: "0 0 15px rgba(17, 255, 0, 0.2)",
  },
  btnRed: {
    color: "#ff0000",
    border: "2px solid #ff0000",
    boxShadow: "0 0 15px rgba(255, 0, 0, 0.2)",
  },
  btnYellow: {
    color: "#ffcc00",
    border: "2px solid #ffcc00",
    boxShadow: "0 0 15px rgba(255, 204, 0, 0.2)",
  },
  divider: {
    height: "0.5px",
    background: "rgb(241, 242, 245)",
    margin: "40px 0",
  },
  // THIẾT KẾ LAYOUT DANH SÁCH FARM CARD
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  farmCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "2px solid rgba(115, 134, 228, 0.4)",
    borderRadius: "16px",
    padding: "20px 25px",
    textAlign: "left",
    boxShadow: "inset 0 0 10px rgba(173, 34, 238, 0.1)",
  },
  cardText: {
    fontSize: "20px",
    margin: "5px 0",
    color: "#5d67ed",
  },
  cardAddress: {
    color: "#efeff68a",
    fontSize: "18px",
    wordBreak: "break-all",
  },
  statusVerified: {
    color: "#54bd3a",
    fontWeight: "bold",
  },
  statusUnverified: {
    color: "#937d85",
    fontWeight: "bold",
    textShadow: "0 0 5px #c46e8a",
  },
};