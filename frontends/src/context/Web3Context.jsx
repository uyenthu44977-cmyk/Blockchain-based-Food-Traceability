import {
  createContext,
  useContext,
  useState,
} from "react";

const Web3Context =
  createContext();

export function Web3Provider({
  children,
}) {

  const [address, setAddress] =
    useState("");

  const [role, setRole] =
    useState("");

  return (
    <Web3Context.Provider
      value={{
        address,
        setAddress,
        role,
        setRole,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}