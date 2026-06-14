import { useWeb3 }
from "../context/Web3Context";

import CertifyBatch
from "../components/CertifyBatch";

export default function
InspectorDashboard() {

  const { role } =
    useWeb3();

  if (
    role !== "INSPECTOR"
  ) {

    return (
      <h2>
        Không có quyền
      </h2>
    );
  }

  return (

    <div>

      <h1>
        INSPECTOR DASHBOARD
      </h1>

      <CertifyBatch />

    </div>

  );
}