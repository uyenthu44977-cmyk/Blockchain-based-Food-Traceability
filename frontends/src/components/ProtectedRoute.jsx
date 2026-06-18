import { useWeb3 }
from "../context/Web3Context";

export default function ProtectedRoute({
  role,
  children,
}) {

  const {
    address,
    role: userRole,
  } = useWeb3();

  if (!address) {
    return (
      <h2>
        Vui lòng kết nối ví
      </h2>
    );
  }

  if (userRole !== role) {
    return (
      <h2>
        Access Denied
      </h2>
    );
  }

  return children;
}