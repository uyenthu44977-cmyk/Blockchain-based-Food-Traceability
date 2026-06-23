import { useWeb3 } from "../context/Web3Context";
import BatchManagement from "../components/BatchManagement";

export default function FarmerDashboard() {
  const { role } = useWeb3();

  // Kiểm tra quyền truy cập Farmer
  if (role !== "FARMER") {



return (

<h2>

Không có quyền

</h2>

);

}



  return (
    <div style={styles.dashboardPage}>
      <div style={styles.dashboardContainer}>
        
        {/* HEADER CỦA FARMER PHÁT SÁNG NEON */}
        <header style={styles.header}>
          <div style={styles.badge}> FARM CONTROL PANEL</div>
          <h1 style={styles.mainTitle}>FARMER DASHBOARD</h1>
          <p style={styles.subtitle}>
            Hệ thống quản lý lô hàng và cập nhật trạng thái chuỗi cung ứng sầu riêng
          </p>
          <div style={styles.divider}></div>
        </header>

        {/* NỘI DUNG CHÍNH GỌI TỪ BATCH MANAGEMENT */}
        <div style={styles.componentWrapper}>
          <BatchManagement />
        </div>

      </div>
    </div>
  );
}

// HỆ THỐNG CSS LAYOUT BÊN NGOÀI
const styles = {
  dashboardPage: {
    background: "#07020f", // Nền tối sâu đồng bộ Admin
    minHeight: "100vh",
    padding: "40px 20px",
    color: "#ffffffaf",
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
    background: "rgba(0, 255, 204, 0.1)",
    border: "1px solid #7b00ff",
    borderRadius: "50px",
    color: "#8800ff",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "2px",
    marginBottom: "15px",
    boxShadow: "0 0 10px rgba(0, 255, 204, 0.2)"
  },
  mainTitle: {
    fontSize: "50px",
    fontWeight: "900",
    margin: "0 0 10px 0",
    color: "#ffffff",
    letterSpacing: "3px",
    textTransform: "uppercase",
    // HIỆU ỨNG NEON XANH ĐỒNG BỘ
    textShadow: `
      0 0 7px #9d00ff,
      0 0 15px #7300ff,
      0 0 30px #9d00ff,
      0 0 60px #9200e6,
      0 0 100px #7400b3
    `
  },
  subtitle: {
    fontStyle: "italic",
    fontSize: "20px",
    color: "#f2eff662",
    margin: "0 0 25px 0"
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, transparent, #ad22ee, #00ffcc, #ad22ee, transparent)",
    width: "100%",
    boxShadow: "0 0 10px #00ffcc"
  },
  componentWrapper: {
    width: "100%"
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "#07020f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    fontSize: "30px",
    fontFamily: "'Smooch Sans', sans-serif",
    textShadow: "0 0 10px #ff3b30"
  }
};