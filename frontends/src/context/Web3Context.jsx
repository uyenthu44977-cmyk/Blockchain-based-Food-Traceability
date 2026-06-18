import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
// Import artifact
import contractArtifact from "../abi/FoodTrace.json";

// Lấy mảng ABI từ artifact
const contractABI = contractArtifact.abi;

// Hardcode địa chỉ contract (bạn có thể chuyển sang .env sau)
const CONTRACT_ADDRESS = "0x396d259fE4b57859d5E05AE30Cb7d667aAc6d234";

console.log("🔍 ABI type:", typeof contractABI);
console.log("🔍 Is ABI array?", Array.isArray(contractABI));
console.log("🔍 ABI length:", contractABI?.length);
console.log("🔍 CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Hãy cài MetaMask");
        return null;
      }

      // 1. Kết nối ví
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      setAddress(walletAddress);

      // 2. Gán role (tạm thời ADMIN)
      const userRole = "ADMIN";
      setRole(userRole);

      // 3. Tạo contract
      try {
        // Kiểm tra ABI có hợp lệ không
        if (!contractABI || !Array.isArray(contractABI) || contractABI.length === 0) {
          throw new Error("ABI không hợp lệ hoặc không phải mảng. Kiểm tra file FoodTrace.json");
        }

        // Kiểm tra địa chỉ
        if (!ethers.isAddress(CONTRACT_ADDRESS)) {
          throw new Error(`Địa chỉ contract không hợp lệ: ${CONTRACT_ADDRESS}`);
        }

        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const ethSigner = await ethProvider.getSigner();

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          ethSigner
        );

        setContract(contractInstance);
        console.log("✅ Contract instance created:", contractInstance);
      } catch (contractError) {
        console.error("❌ Lỗi tạo contract:", contractError);
        alert("Lỗi tạo contract: " + contractError.message);
        // Vẫn giữ contract = null nhưng không block navigation
      }

      console.log("✅ Connected:", walletAddress);
      console.log("✅ Role:", userRole);
      return userRole;
    } catch (error) {
      console.error("❌ Lỗi kết nối ví:", error);
      alert("Lỗi kết nối: " + error.message);
      return null;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        setAddress,
        role,
        setRole,
        contract,
        connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}