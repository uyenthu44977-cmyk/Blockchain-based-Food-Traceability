import { useWeb3 }
from "../context/Web3Context";

import RoleManagement
from "../components/RoleManagement";

export default function AdminDashboard() {

  const { role } =
    useWeb3();

  if (role !== "ADMIN") {

    return (
      <h2>
        Không có quyền
      </h2>
    );
  }

  return (

    <div>

      <h1>
        ADMIN DASHBOARD
      </h1>

      <RoleManagement />

    </div>

  );
}