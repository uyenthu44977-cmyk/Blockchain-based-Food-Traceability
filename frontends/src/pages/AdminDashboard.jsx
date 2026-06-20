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
          ⚠️ CẢNH BÁO: Bạn không có quyền truy cập khu vực này!
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardPage}>
      <div style={styles.dashboardContainer}>
        {/* KHU VỰC HEADER CỦA ADMIN */}
        <header style={styles.header}>
          <div style={styles.badge}>🛡️ SYSTEM CONTROL</div>
          <h1 style={styles.mainTitle}>DURIANCHAIN ADMIN PANELS</h1>
          <p style={styles.subtitle}>
            Hệ thống quản lý chuỗi cung ứng sầu riêng trên nền tảng Blockchain
          </p>
          <div style={styles.divider}></div>
        </header>

        {/* NỘI DUNG CHÍNH: QUẢN LÝ VAI TRÒ */}
        <section style={styles.sectionBox}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>👥</span>
            <h2 style={styles.sectionTitle}>PHÂN QUYỀN THÀNH VIÊN (ROLE MANAGEMENT)</h2>
          </div>
          <p style={styles.sectionDesc}>
            Cấp quyền hoặc thu hồi các vai trò Farmer (Nông dân), Inspector (Kiểm định viên) trực tiếp trên Smart Contract.
          </p>
          
          {/* Component xử lý logic của bạn được bọc trong lớp layout mới */}
          <div style={styles.componentWrapper}>
            <RoleManagement />
          </div>
        </section>
      </div>
    </div>
  );
}

// HỆ THỐNG CSS STYLE ĐỒNG BỘ PHONG CÁCH PHÁT QUANG CYBERPUNK
const styles = {
  dashboardPage: {
    background: "#07020f", // Nền tối sâu hoắm
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
    padding: "4px 12px",
    background: "rgba(255, 0, 85, 0.1)",
    border: "1px solid #ff0055",
    borderRadius: "4px",
    color: "#ff3377",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "15px",
    boxShadow: "0 0 10px rgba(255, 0, 85, 0.2)"
  },
  mainTitle: {
    fontSize: "45px",
    fontWeight: "900",
    margin: "0 0 10px 0",
    color: "#00ffcc", // Màu xanh Cyan phát sáng công nghệ
    textShadow: "0 0 15px rgba(0, 255, 204, 0.6)",
    letterSpacing: "3px"
  },
  subtitle: {
    fontSize: "20px",
    color: "#a59cb0",
    margin: "0 0 25px 0"
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #ad22ee, #00ffcc, #ad22ee, transparent)",
    width: "100%",
    boxShadow: "0 0 10px #00ffcc"
  },
  sectionBox: {
    background: "#0d021a", // Nền hộp tối giống popup
    border: "2px solid #ad22ee", // Viền màu tím neon
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 0 20px rgba(173, 34, 238, 0.25), inset 0 0 15px rgba(0, 255, 204, 0.05)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px"
  },
  sectionIcon: {
    fontSize: "28px",
    filter: "drop-shadow(0 0 5px #ad22ee)"
  },
  sectionTitle: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "1.5px"
  },
  sectionDesc: {
    fontSize: "18px",
    color: "#8e829d",
    margin: "0 0 25px 0"
  },
  componentWrapper: {
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    padding: "20px",
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
    color: "#00ffcc",
    fontSize: "30px",
    fontFamily: "'Smooch Sans', sans-serif",
    textShadow: "0 0 10px #00ffcc"
  }
};