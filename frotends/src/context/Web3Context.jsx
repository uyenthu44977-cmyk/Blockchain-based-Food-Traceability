import {
  createContext,
  useContext,
  useState
} from "react";


import { ethers } from "ethers";


import CONTRACT_ABI
from "../abi/FoodTrace.json";


const Web3Context = createContext();


const CONTRACT_ADDRESS =
import.meta.env.VITE_CONTRACT_ADDRESS;


export const Web3Provider = ({
  children
}) => {


  const [address, setAddress] =
    useState("");


  const [balance, setBalance] =
    useState("");


  const [role, setRole] =
    useState("");


  const [signer, setSigner] =
    useState(null);


  const [contract, setContract] =
    useState(null);


  const connectWallet = async () => {


    try {


      if (!window.ethereum) {
        alert("Vui lòng cài MetaMask");
        return;
      }


      // provider
      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );


      // mở metamask
      await provider.send(
        "eth_requestAccounts",
        []
      );


      // signer
      const signer =
        await provider.getSigner();


      // address
      const walletAddress =
        await signer.getAddress();


      // contract
      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI.abi,
          signer
        );


      // balance
      const balanceWei =
        await provider.getBalance(
          walletAddress
        );


      const balanceEth =
        ethers.formatEther(balanceWei);


      // Lấy role từ constants
      const userRole =
        await contract.getMyRole(
          walletAddress
        );


      setAddress(walletAddress);


      setBalance(
        Number(balanceEth).toFixed(4)
      );


      setRole(userRole);


      setSigner(signer);


      setContract(contract);


      return userRole;


    } catch (error) {


      console.error(error);


      return null;
    }
  };


  return (
    <Web3Context.Provider
      value={{
        address,
        balance,
        role,
        signer,
        contract,
        connectWallet
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};


export const useWeb3 = () =>
  useContext(Web3Context);



