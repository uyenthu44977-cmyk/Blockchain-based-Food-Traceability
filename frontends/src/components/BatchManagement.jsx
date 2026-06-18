import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function BatchManagement() {

  const {
    contract,
    address
  } = useWeb3();

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] =
    useState(false);

  // =========================
  // BATCH LIST
  // =========================

  const [myBatches,
    setMyBatches] =
    useState([]);

  const loadMyBatches =
    async () => {

      try {

        const result =
          await contract.getFarmerBatches(
            address
          );

        setMyBatches(result);

      } catch (error) {

        console.log(error);

      }
    };

  // =========================
  // CREATE BATCH
  // =========================

  const [formData, setFormData] =
    useState({
      batchCode: "",
      durianType: 0,
      origin: "",
      plantingAreaCode: "",
      packingHouseCode: "",
      exportMarket: "",
      certHash: "",
      certType: "",
      quantity: ""
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const createBatch =
    async () => {

      try {

        setLoading(true);

        const tx =
          await contract.createBatch(
            formData.batchCode,
            Number(
              formData.durianType
            ),
            formData.origin,
            formData.plantingAreaCode,
            formData.packingHouseCode,
            formData.exportMarket,
            formData.certHash,
            formData.certType,
            Number(
              formData.quantity
            )
          );

        await tx.wait();

        alert(
          "Tạo lô hàng thành công"
        );

      } catch (error) {

        alert(
          error.reason ||
          error.message
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // STATUS
  // =========================

  const [statusBatchId,
    setStatusBatchId] =
    useState("");

  const updateStatus =
    async (status) => {

      try {

        setLoading(true);

        const tx =
          await contract.updateStatus(
            Number(statusBatchId),
            status
          );

        await tx.wait();

        alert(
          "Cập nhật trạng thái thành công"
        );

      } catch (error) {

        alert(
          error.reason ||
          error.message
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // PACKED
  // =========================

  const [packedBatchId,
    setPackedBatchId] =
    useState("");

  const markPacked =
    async () => {

      try {

        setLoading(true);

        const tx =
          await contract.markPacked(
            Number(
              packedBatchId
            )
          );

        await tx.wait();

        alert(
          "Đóng gói thành công"
        );

      } catch (error) {

        alert(
          error.reason ||
          error.message
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // TRANSPORT
  // =========================

  const [transportData,
    setTransportData] =
    useState({
      batchId: "",
      location: "",
      temperature: ""
    });

  const handleTransportChange =
    (e) => {

      setTransportData({
        ...transportData,
        [e.target.name]:
          e.target.value
      });

    };

  const updateTransport =
    async () => {

      try {

        setLoading(true);

        const tx =
          await contract.updateTransport(
            Number(
              transportData.batchId
            ),
            transportData.location,
            Number(
              transportData.temperature
            )
          );

        await tx.wait();

        alert(
          "Cập nhật vận chuyển thành công"
        );

      } catch (error) {

        alert(
          error.reason ||
          error.message
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // RECALL
  // =========================

  const [recallData,
    setRecallData] =
    useState({
      batchId: "",
      reason: ""
    });

  const handleRecallChange =
    (e) => {

      setRecallData({
        ...recallData,
        [e.target.name]:
          e.target.value
      });

    };

  const recallBatch =
    async () => {

      try {

        setLoading(true);

        const tx =
          await contract.recallBatch(
            Number(
              recallData.batchId
            ),
            recallData.reason
          );

        await tx.wait();

        alert(
          "Thu hồi thành công"
        );

      } catch (error) {

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
        Farmer Dashboard
      </h2>

      {
        loading &&
        <p>
          Đang xử lý...
        </p>
      }

      <hr />

      <h3>
        Danh sách batch
      </h3>

      <button
        onClick={
          loadMyBatches
        }
      >
        Tải danh sách
      </button>

      {
        myBatches.map(
          (id) => (
            <div
              key={id.toString()}
            >
              Batch ID:
              {
                id.toString()
              }
            </div>
          )
        )
      }

      <hr />

      <h3>
        Tạo lô hàng
      </h3>

      <input
        name="batchCode"
        placeholder="Batch Code"
        onChange={handleChange}
      />

      <input
        name="origin"
        placeholder="Origin"
        onChange={handleChange}
      />

      <input
        name="plantingAreaCode"
        placeholder="Planting Area"
        onChange={handleChange}
      />

      <input
        name="packingHouseCode"
        placeholder="Packing House"
        onChange={handleChange}
      />

      <input
        name="exportMarket"
        placeholder="Export Market"
        onChange={handleChange}
      />

      <input
        name="certHash"
        placeholder="Cert Hash"
        onChange={handleChange}
      />

      <input
        name="certType"
        placeholder="Cert Type"
        onChange={handleChange}
      />

      <input
        name="quantity"
        placeholder="Quantity"
        onChange={handleChange}
      />

      <select
        name="durianType"
        onChange={handleChange}
      >
        <option value={0}>
          Ri6
        </option>

        <option value={1}>
          Monthong
        </option>

        <option value={2}>
          Musang King
        </option>
      </select>

      <button
        onClick={
          createBatch
        }
      >
        Create Batch
      </button>

      <hr />

      <h3>
        Update Status
      </h3>

      <input
        placeholder="Batch ID"
        value={statusBatchId}
        onChange={(e) =>
          setStatusBatchId(
            e.target.value
          )
        }
      />

      <button onClick={() => updateStatus(1)}>
        Harvested
      </button>

      <button onClick={() => updateStatus(2)}>
        Processing
      </button>

      <button onClick={() => updateStatus(4)}>
        Transporting
      </button>

      <button onClick={() => updateStatus(5)}>
        Delivered
      </button>

      <hr />

      <h3>
        Mark Packed
      </h3>

      <input
        placeholder="Batch ID"
        value={packedBatchId}
        onChange={(e) =>
          setPackedBatchId(
            e.target.value
          )
        }
      />

      <button
        onClick={
          markPacked
        }
      >
        Mark Packed
      </button>

      <hr />

      <h3>
        Update Transport
      </h3>

      <input
        name="batchId"
        placeholder="Batch ID"
        onChange={
          handleTransportChange
        }
      />

      <input
        name="location"
        placeholder="Location"
        onChange={
          handleTransportChange
        }
      />

      <input
        name="temperature"
        placeholder="Temperature"
        onChange={
          handleTransportChange
        }
      />

      <button
        onClick={
          updateTransport
        }
      >
        Update Transport
      </button>

      <hr />

      <h3>
        Recall Batch
      </h3>

      <input
        name="batchId"
        placeholder="Batch ID"
        onChange={
          handleRecallChange
        }
      />

      <input
        name="reason"
        placeholder="Reason"
        onChange={
          handleRecallChange
        }
      />

      <button
        onClick={
          recallBatch
        }
      >
        Recall Batch
      </button>

    </div>

  );
}