import {useWeb3} from "../context/Web3Context";

export default function ConnectWallet() {

  const {
    connectWallet,
    address,
    balance,
    role
  } = useWeb3();

  const shortAddress = (addr) => {
    return `${addr.slice(0,6)}...${addr.slice(-4)}`;
  };

  return (

    <div>

      {!address ? (

        <button
          onClick={connectWallet}
        >
          Connect Wallet
        </button>

      ) : (

        <div>

          <p>
            {shortAddress(address)}
          </p>

          <p>
            {balance} ETH
          </p>

          <p>
            {role}
          </p>

        </div>

      )}

    </div>
  );
}