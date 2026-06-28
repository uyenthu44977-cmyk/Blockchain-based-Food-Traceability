import CertificateManagement from "../components/CertificateManagement";
import { useWeb3 } from "../context/Web3Context";
import RoleManagement from "../components/RoleManagement";

export default function AdminDashboard() {
  const { role } = useWeb3();

  // Đọc quyền từ cả context và localStorage để đảm bảo quá trình giả lập role mượt mà
  const currentRole = role || localStorage.getItem("role");

  if (!currentRole) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  // Cho phép ADMIN thực sự (hoặc giả lập ADMIN) đi vào
  if (currentRole !== "ADMIN") {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ ...styles.loadingText, color: "#ff3b30" }}>
          CẢNH BÁO: Bạn không có quyền truy cập khu vực này!
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardPage}>
      <div style={styles.dashboardContainer}>
        {/* KHU VỰC HEADER CỦA ADMIN */}
        <header style={styles.header}>
          <div style={styles.badge}>SYSTEM CONTROL</div>
          {/* TIÊU ĐỀ CHINH*/}
          <h1 style={styles.mainTitle}>DURIANCHAIN ADMIN PANELS</h1>
          <p style={styles.subtitle}>
            Hệ thống quản lý chuỗi cung ứng sầu riêng trên nền tảng Blockchain
          </p>
          <div style={styles.divider}></div>
        </header>

        {/* NỘI DUNG CHÍNH: QUẢN LÝ VAI TRÒ */}
        <section style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>PHÂN QUYỀN THÀNH VIÊN (ROLE MANAGEMENT)</h2>
          </div>
          <p style={styles.sectionDesc}>
            Cấp quyền hoặc thu hồi các vai trò Farmer (Nông dân), Inspector (Kiểm định viên) trực tiếp trên Smart Contract
          </p>
          
          {/* Component xử lý logic được bọc trong bộ bo góc mới */}
          <div style={styles.componentWrapper}>
            <RoleManagement />
          </div>
        </section>
        <section style={styles.sectionBox}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            CERTIFICATE MANAGEMENT
          </h2>
        </div>

        <p style={styles.sectionDesc}>
          Upload và quản lý chứng nhận của Farmer
        </p>

        <div style={styles.componentWrapper}>
          <CertificateManagement />
        </div>
      </section>
      </div>
    </div>
  );
}

// HỆ THỐNG CSS STYLE TẬP TRUNG - DỄ CHỈNH SỬA
const styles = {
  // ==========================================
  // BẢNG ĐIỀU KHIỂN TRUNG TÂM (THAY ĐỔI TẠI ĐÂY LÀ TOÀN BỘ WEB ĐỔI THEO)
  // ==========================================
  GLOBAL_FONT: "'Smooch Sans', sans-serif",  // Font chữ toàn trang
  BO_GOC_TRON: "15px",                       // Bạn muốn khung tròn bo góc luôn (50px tạo nút hình viên nhộng/khung siêu tròn)
  BO_GOC_HOP: "15px",                        // Bo góc cho hộp lớn (Section Box)
  

  // ==========================================
  // CẤU TRÚC LAYOUT CHI TIẾT (ĐÃ KẾ THỪA TỪ BẢNG TRÊN)
  // ==========================================
  dashboardPage: {
    background: "var(--bg-page, #0b0317d5)",
    minHeight: "100vh",
    padding: "40px 20px",
    color: "#ffffff",
    fontFamily: "'Smooch Sans', sans-serif",
    letterSpacing: "1px"
  },
  dashboardContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    background: "rgba(101, 12, 42, 0.1)",
    border: "1px solid #e41313",
    borderRadius: "50px",                   // Đã bo tròn khung badge
    color: "#f10a0a",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "15px",
    boxShadow: "0 0 10px rgba(255, 0, 85, 0.2)"
  },
  mainTitle: {
    fontSize: "50px",                       // Tăng size chữ lớn hơn chút
    fontWeight: "900",
    margin: "0 0 10px 0",
    color: "#ffffff",                       // Màu lõi trắng giúp ánh sáng Neon trông thật hơn
    letterSpacing: "3px",
    textTransform: "uppercase",
    
    // HIỆU ỨNG NEON 
    textShadow: `
      0 0 7px #00bfff,
      0 0 15px #00bfff,
      0 0 30px #00bfff,
      0 0 60px #00bfff,
      0 0 100px #0051ff
    `
  },
  subtitle: {
    fontSize: "20px",
    fontStyle: "italic",
    color: "#b6b2bcc3",
    margin: "0 0 25px 0"
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #ad22ee, #00ffcc, #ad22ee, transparent)",
    width: "100%",
    boxShadow: "0 0 10px #00aeff"
  },
  sectionBox: {
    background: "#cecadf52",
    border: "2px solid #f0f0f5", 
    borderRadius: "10px",                   // Bo góc hộp lớn mượt mà hơn (24px)
    padding: "30px",
    boxShadow: "0 0 24px rgba(221, 209, 226, 0.3), inset 0 0 15px rgba(0, 255, 204, 0.05)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },
  
  sectionTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#f1f1f0",
    margin: 0,
    letterSpacing: "1.5px"
  },
  sectionDesc: {
    fontSize: "15px",
    color: "#f2f1f491",
    margin: "0 0 25px 0"
  },
  componentWrapper: {
    background: "rgba(0, 0, 0, 0.4)",
    borderRadius: "50px",                   // BO TRÒN KHUNG CHỨA (Có tác dụng bo tròn các nút bên trong nếu chúng kế thừa)
    padding: "25px",
    border: "1px solid rgba(173, 34, 238, 0.2)",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "#07020f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    color: "#88b6dc",
    fontSize: "15px",
    fontFamily: "'Smooch Sans', sans-serif",
    textShadow: "0 0 10px #00ffcc"
  }
};