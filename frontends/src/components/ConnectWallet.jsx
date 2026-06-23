import { useState } from "react";

import { useWeb3 } from "../context/Web3Context";

import { useNavigate } from "react-router-dom";



export default function ConnectWallet() {

  const { connectWallet } = useWeb3();

  const navigate = useNavigate();



  const [loading, setLoading] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);

  const [showDeniedModal, setShowDeniedModal] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");



  const handleConnect = async () => {

    setLoading(true);

try {
  const result = await connectWallet();
      if (!result) {

        alert("Không tìm thấy thông tin tài khoản!");

        return;

      }



      const { role, wallet } = result;

console.log("========== LOGIN ==========");
console.log("Wallet:", wallet);
console.log("Role:", role);

      setWalletAddress(wallet);



      if (role === "ADMIN") {

        localStorage.setItem("role", "ADMIN");

        localStorage.setItem("viewMode", "ADMIN");



        setShowAdminModal(true);

      } else if (role === "FARMER") {

        localStorage.setItem("role", "FARMER");

        localStorage.setItem("viewMode", "NORMAL");



        navigate("/farmer");

      } else if (role === "INSPECTOR") {

        localStorage.setItem("role", "INSPECTOR");

        localStorage.setItem("viewMode", "NORMAL");



        navigate("/inspector");

      } else {

        setShowDeniedModal(true);

      }

    } catch (error) {

      console.error(error);

      alert("Kết nối MetaMask thất bại!");

    } finally {

      setLoading(false);

    }

  };



  const openAdminDashboard = () => {

    localStorage.setItem("viewMode", "ADMIN");



    setShowAdminModal(false);



    navigate("/admin");

  };



  const openFarmerDashboard = () => {

    localStorage.setItem("viewMode", "ADMIN_VIEW");



    setShowAdminModal(false);



    navigate("/farmer");

  };



  const openInspectorDashboard = () => {

    localStorage.setItem("viewMode", "ADMIN_VIEW");



    setShowAdminModal(false);



    navigate("/inspector");

  };



  return (

    <>

      <button

        onClick={handleConnect}

        disabled={loading}

        style={{

          fontFamily: "'Smooch Sans', sans-serif",

          padding: "20px 30px",

          background: "transparent",

          color: "#ba1edd",

          border: "2px solid #ad22ee",

          borderRadius: "50px",

          fontSize: "25px",

          cursor: "pointer",

          boxShadow: "0 0 10px #af88bc, 0 0 25px #a722ee",

          opacity: loading ? 0.6 : 1,

        }}

      >

        {loading

          ? "Checking Contract..."

          : "Connect Wallet"}

      </button>



      {showAdminModal && (

        <div style={styles.overlay}>

          <div style={styles.modal}>

            <h2 style={styles.title}>

              ADMIN MODE

            </h2>



            <p style={styles.wallet}>

              Wallet: {walletAddress}

            </p>



            <p style={styles.subtitle}>

              Chọn chế độ muốn xem

            </p>



            <div style={styles.buttonGroup}>

              <button

                style={styles.roleButton}

                onClick={openAdminDashboard}

              >

                Xem Admin Dashboard

              </button>



              <button

                style={styles.roleButton}

                onClick={openFarmerDashboard}

              >

                Xem Farmer Dashboard

              </button>



              <button

                style={styles.roleButton}

                onClick={openInspectorDashboard}

              >

                Xem Inspector Dashboard

              </button>

            </div>



            <button

              style={styles.closeButton}

              onClick={() =>

                setShowAdminModal(false)

              }

            >

              Đóng

            </button>

          </div>

        </div>

      )}



      {showDeniedModal && (

        <div style={styles.overlay}>

          <div

            style={{

              ...styles.modal,

              border: "2px solid #ff3b30",

              boxShadow:

                "0 0 20px #ff3b30",

            }}

          >

            <h2 className="access-denied"

              style={{

                color: "#f8f0f0",

                fontFamily: "'Smooch Sans', sans-serif",

                fontSize: "45px",

                fontWeight: "700",

                letterSpacing: "3px",

                textTransform: "uppercase",

                animation: "dangerGlow 1s infinite",

                textShadow: `

                   0 0 5px #ff3b30,

                   0 0 10px #ff3b30,

                   0 0 20px #ff3b30,

                   0 0 40px #ff0000,

                   0 0 80px #ff0000

                `

              }}

            >

              ACCESS DENIED

            </h2> 



            <p style={styles.wallet}>

              Wallet: {walletAddress}

            </p>



            <p style={styles.subtitle}>

              Bạn chưa được cấp quyền

              sử dụng hệ thống

            </p>



            <p style={styles.subtitle}>

              Vui lòng liên hệ quản trị viên

            </p>



            <button

              style={styles.closeButton}

              onClick={() =>

                setShowDeniedModal(false)

              }

            >

              Đóng

            </button>

          </div>

        </div>

      )}

    </>

  );

}



const styles = {
  // 1. LỚP PHỦ MỜ PHÍA SAU (OVERLAY)
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(63, 53, 82, 0.18)",   // Tăng độ tối của nền phía sau (RGBA)
    backdropFilter: "blur(5px)",         // Tăng độ mờ background sau khung (từ 8px lên 10px)
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  // 2. KHUÔN KHUNG CHÍNH (MODAL)
  modal: {
    background: "#090314",                // MÀU NỀN KHUNG: Thay đổi mã màu Hex ở đây
    border: "3px solid #0095ff",          // MÀU VIỀN KHUNG: Đổi độ dày (3px) hoặc đổi mã màu (#00ffcc)
    borderRadius: "20px",                 // ĐỘ BO GÓC KHUNG: Số càng to góc càng tròn (ví dụ: 20px)
    padding: "40px",                      // KHOẢNG CÁCH ĐỆM: Khoảng trống từ viền khung vào đến chữ bên trong
    width: "550px",                       // KÍCH THƯỚC ĐỘ RỘNG KHUNG: Bạn có thể tăng lên 600px nếu muốn to hơn
    textAlign: "center",
    color: "#fff",
    fontFamily: "'Smooch Sans', sans-serif", // FONT CHỮ CHÍNH: Thay font khác tại đây (Ví dụ: 'Arial', 'Segoe UI')
    boxShadow: "0 0 30px #0095ff",        // ĐỘ PHÁT SÁNG (GLOW): Thay đổi màu phát sáng của viền khung
  },

  // 3. TIÊU ĐỀ (ADMIN MODE)
  title: {
    color: "#f7f9f9",                       // Giữ màu chữ cốt lõi là trắng hoặc màu sáng nhẹ
    fontSize: "50px",                    
    fontWeight: "800",                    
    marginBottom: "20px",                 
    letterSpacing: "3px",                 // Tăng khoảng cách chữ nhìn cho ngầu
    textTransform: "uppercase",

    // ĐOẠN THÊM HIỆU ỨNG NEON (Ví dụ này dùng Neon Xanh Cyan cực sáng):
    textShadow: `
       0 0 5px #00d0ff,
       0 0 10px #00bfff,
       0 0 20px #00a6ff,
       0 0 40px #00e6b8,
       0 0 80px #0054b3
    `
  },

  // 4. DÒNG HIỂN THỊ ĐỊA CHỈ VÍ (WALLET)
  wallet: {
    color: "#f4f0f066",                    // MÀU CHỮ VÍ: Hiện tại đang màu đỏ, bạn có thể đổi sang #ffcc00 (Vàng) cho dễ nhìn
    fontSize: "20px",                    // SIZE CHỮ VÍ (Tăng từ 18px lên 20px)
    marginBottom: "20px",
    wordBreak: "break-all",
    padding: "8px 12px",
    background: "rgba(131, 128, 194, 0.05)", // Thêm một lớp nền mờ nhẹ riêng cho dòng ví để làm nổi bật
    borderRadius: "8px",
  },

  // 5. DÒNG CHỮ PHỤ (CHỌN CHẾ ĐỘ MUỐN XEM)
  subtitle: {
    color: "#e4ecec",                    // MÀU CHỮ PHỤ
    fontSize: "22px",                    // SIZE CHỮ PHỤ (Tăng từ 20px lên 24px)
    fontFamily: "'Smooch Sans', sans-serif",
    lineHeight: "1.4",                   // KHOẢNG CÁCH DÒNG: Tăng lên 1.4 để chữ không bị dính đè vào nhau (cũ là 0.5)
    marginBottom: "15px",
  },

  // 6. KHỐI CHỨA CÁC NÚT BẤM
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",                         // Khoảng cách xa gần giữa các nút bấm với nhau
    marginTop: "10px",
  },

  // 7. CÁC NÚT CHỌN DASHBOARD (XEM ADMIN/FARMER/INSPECTOR)
  roleButton: {
    padding: "15px",                      // Độ lớn/độ dày của nút bấm
    background: "rgba(22, 12, 61, 0.51)", // MÀU NỀN NÚT BẤM (Đang là màu tím mờ 10%)
    border: "2px solid #f1ebf2",          // MÀU VIỀN NÚT BẤM: Tăng lên 2px cho rõ nét viền hồng tím
    borderRadius: "10px",                 // Độ bo góc của nút bấm
    color: "#3848c1",                    // MÀU CHỮ TRONG NÚT: Đổi từ đỏ chói sang màu xanh Neon cho đồng bộ và dễ đọc
    fontSize: "22px",                    // SIZE CHỮ TRONG NÚT
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Smooch Sans', sans-serif",
    transition: "all 0.3s ease",          // Hiệu ứng mượt mà khi rê chuột
  },

  // 8. NÚT ĐÓNG (DƯỚI CÙNG)
  closeButton: {
    marginTop: "25px",
    background: "transparent",
    border: "none",
    color: "#17d1e1",                    // MÀU CHỮ NÚT ĐÓNG
    cursor: "pointer",
    fontSize: "22px",                    // SIZE CHỮ NÚT ĐÓNG
    fontFamily: "'Smooch Sans', sans-serif",
    textDecoration: "underline",         // Đường gạch chân chữ "Đóng"
  },
};