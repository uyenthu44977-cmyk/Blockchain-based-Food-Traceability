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

alert(`
Wallet:
${wallet}

Role:
${role}
`);
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

  overlay: {

    position: "fixed",

    top: 0,

    left: 0,

    width: "100vw",

    height: "100vh",

    background: "rgba(7,2,15,0.9)",

    backdropFilter: "blur(8px)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    zIndex: 9999,

  },



  modal: {

    background: "#0d021a",

    border: "2px solid #00ffcc",

    borderRadius: "16px",

    padding: "35px",

    width: "500px",

    textAlign: "center",

    color: "#fff",

    fontFamily:

      "'Smooch Sans', sans-serif",

    boxShadow: "0 0 20px #00ffcc",

  },



  title: {

    color: "#00ffcc",

    fontSize: "40px",

    marginBottom: "15px",

  },



  wallet: {

    color: "#e71111",

    fontSize: "18px",

    marginBottom: "15px",

    wordBreak: "break-all",

  },



  subtitle: {

    color: "#e4ecec",

    fontSize: "20px",

    fontFamily: "'Smooch Sans', sans-serif",

    lineHeight: "0.5",

  },



  buttonGroup: {

    display: "flex",

    flexDirection: "column",

    gap: "15px",

    marginTop: "25px",

  },



  roleButton: {

    padding: "14px",

    background:

      "rgba(186,30,221,0.1)",

    border:

      "1px solid rgba(186,30,221,0.5)",

    borderRadius: "10px",

    color: "#d81f1f",

    fontSize: "22px",

    cursor: "pointer",

    fontFamily:

      "'Smooch Sans', sans-serif",

  },



  closeButton: {

    marginTop: "15px",

    background: "transparent",

    border: "none",

    color: "#17d1e1",

    cursor: "pointer",

    fontSize: "20px",

    fontFamily: "'Smooch Sans', sans-serif",

    textDecoration: "underline",

  },

};