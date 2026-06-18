import { useWeb3 }
from "../context/Web3Context";

import BatchManagement
from "../components/BatchManagement";

export default function FarmerDashboard() {

  const { role } =
    useWeb3();

  if (role !== "FARMER") {

    return (
      <h2>
        Không có quyền
      </h2>
    );
  }

  return (

    <div>

      <h1>
        FARMER DASHBOARD
      </h1>

      <BatchManagement />

    </div>

  );
}