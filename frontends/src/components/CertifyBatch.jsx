import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function CertifyBatch() {

  const { contract } =
    useWeb3();

  const [batchId,
    setBatchId] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const certifyBatch =
    async () => {

      try {

        if (!batchId) {

          alert(
            "Nhập Batch ID"
          );

          return;
        }

        setLoading(true);

        const tx =
          await contract.certifyBatch(
            Number(batchId)
          );

        await tx.wait();

        alert(
          "Chứng nhận thành công"
        );

        setBatchId("");

      } catch (error) {

        console.log(error);

        alert(
          error.reason ||
          error.message
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div>

      <h2>
        Chứng nhận lô hàng
      </h2>

      <input
        type="number"
        placeholder="Batch ID"
        value={batchId}
        onChange={(e)=>
          setBatchId(
            e.target.value
          )
        }
      />

      <button
        onClick={certifyBatch}
        disabled={loading}
      >

        {
          loading
          ? "Đang xử lý..."
          : "Certify"
        }

      </button>

    </div>

  );
}