import {useWeb3} from "../context/Web3Context";
import { useNavigate } from "react-router-dom";
export default function ConnectWallet() {


  const {connectWallet} = useWeb3();


  const navigate = useNavigate();


  const handleConnect = async () => {


    const role =
      await connectWallet();


    if (!role) return;


    if (role === "ADMIN") {


      navigate("/admin");


    }
    else if (
      role === "FARMER"
    ) {


      navigate("/farmer");


    }
    else if (
      role === "INSPECTOR"
    ) {
      navigate("/inspector");
    }
    else {
      alert("Ví này không có quyền quản lý hệ thống");
    }
  };


  return (


    <button
      onClick={handleConnect}
    >
      Connec
    </button>


  );
}

