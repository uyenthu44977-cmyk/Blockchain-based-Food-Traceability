import {useWeb3} from "../context/Web3Context";
import { useNavigate } from "react-router-dom";
export default function ConnectWallet() {


  const {connectWallet} = useWeb3();


  const navigate = useNavigate();


const handleConnect = async () => {

  const role = await connectWallet();

  if (!role) return;

  // delay nhẹ để đảm bảo state sync
  setTimeout(() => {

    if (role === "ADMIN") {
      navigate("/admin");
    }

    else if (role === "FARMER") {
      navigate("/farmer");
    }

    else if (role === "INSPECTOR") {
      navigate("/inspector");
    }

    else {
      alert("Ví này không có quyền quản lý hệ thống");
    }

  }, 50);
};


return (
  <button
    onClick={handleConnect}
    style={{
      fontFamily: "'Smooch Sans', sans-serif",
      padding: "20px 30px",
      background: "transparent",
      color: "#eae1ec",
      border: "2px solid #22b8ee",
      borderRadius: "50px",
      fontSize: "25px",
      cursor: "pointer",
      boxShadow: "0 0 10px #88b5bc, 0 0 25px #22d3ee"
    }}
  >
    Connect Wallet
  </button>
);

}
