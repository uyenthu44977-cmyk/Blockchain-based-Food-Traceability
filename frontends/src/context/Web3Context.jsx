import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "../abi/FoodTrace.json";

const contractABI = contractArtifact.abi;

const CONTRACT_ADDRESS =
  "0x396d259fE4b57859d5E05AE30Cb7d667aAc6d234";

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

     const accounts = await window.ethereum.request({
  method: "eth_requestAccounts",
});

const walletAddress = accounts[0].toLowerCase();

      setAddress(walletAddress);

      let userRole = "NONE";

      try {
        if (!contractABI || !Array.isArray(contractABI)) {
          throw new Error("ABI không hợp lệ");
        }

        const provider = new ethers.BrowserProvider(
          window.ethereum
        );
const network = await provider.getNetwork();

console.log("Chain ID:", network.chainId);

        const signer =
          await provider.getSigner();

        const contractInstance =
  new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    signer
  );

setContract(contractInstance);

console.log(
  "Admin role:",
  await contractInstance.getMyRole(
    "0x6A0EA560D15c8DD9309600f2fF330E63bbf0bD21"
  )
);

console.log(
  "Farmer role:",
  await contractInstance.getMyRole(
    "0x72Bf7BFf64678Add444Be8f5f2A6afaB809Af1f6"
  )
);

console.log(
  "Inspector role:",
  await contractInstance.getMyRole(
    "0x5087c07ae72AC29B409fD3823aF8E3F599A224C1"
  )
);

const roleFromContract =
  await contractInstance.getMyRole(
    walletAddress
  );


userRole =
  roleFromContract.toUpperCase();

console.log(
  "Wallet:",
  walletAddress
);

console.log(
  "Role:",
  userRole
); 
      } catch (contractError) {
        console.error(
          "Contract Error:",
          contractError
        );

        userRole = "NONE";
      }
      alert(
  `Wallet: ${walletAddress}
Role: ${userRole}`
);

      setRole(userRole);

      localStorage.setItem(
        "role",
        userRole
      );

      localStorage.setItem(
        "walletAddress",
        walletAddress
      );

      return {
        role: userRole,
        wallet: walletAddress,
      };
    } catch (error) {
      console.error(error);

      alert(
        "Lỗi kết nối MetaMask"
      );

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