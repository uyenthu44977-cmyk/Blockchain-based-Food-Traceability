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
process.env.REACT_APP_CONTRACT_ADDRESS;

export const Web3Provider = ({
  children
}) => {

  const [address, setAddress] =
    useState("");

  const [balance, setBalance] =
    useState("");

  const [role, setRole] =
    useState("");

  const [contract, setContract] =
    useState(null);

  const connectWallet = async () => {

    try {

      if (!window.ethereum) {
        alert("Cài MetaMask");
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

      // role constants
      const FARMER_ROLE =
        ethers.keccak256(
          ethers.toUtf8Bytes(
            "FARMER_ROLE"
          )
        );

      const INSPECTOR_ROLE =
        ethers.keccak256(
          ethers.toUtf8Bytes(
            "INSPECTOR_ROLE"
          )
        );

      // check roles
      const isFarmer =
        await contract.hasRole(
          FARMER_ROLE,
          walletAddress
        );

      const isInspector =
        await contract.hasRole(
          INSPECTOR_ROLE,
          walletAddress
        );

      const owner =
        await contract.owner();

      // xác định role
      if (
        owner.toLowerCase()
        ===
        walletAddress.toLowerCase()
      ) {
        setRole("admin");
      }
      else if (isInspector) {
        setRole("inspector");
      }
      else if (isFarmer) {
        setRole("farmer");
      }
      else {
        setRole("guest");
      }

      setAddress(walletAddress);

      setBalance(
        Number(balanceEth).toFixed(4)
      );

      setContract(contract);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <Web3Context.Provider
      value={{
        address,
        balance,
        role,
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