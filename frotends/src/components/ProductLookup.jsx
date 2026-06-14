import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function ProductLookup() {

  const { contract } =
    useWeb3();

  const [batchId,
    setBatchId] =
    useState("");

  const [batchInfo,
    setBatchInfo] =
    useState(null);

  const [history,
    setHistory] =
    useState([]);

  const [transportHistory,
    setTransportHistory] =
    useState([]);

  const [safeInfo,
    setSafeInfo] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  // enum Status trong contract
  const statusMap = {
    0: "Created",
    1: "Harvested",
    2: "Processing",
    3: "Packed",
    4: "Transporting",
    5: "Delivered",
    6: "Recalled"
  };

  const lookupProduct =
    async () => {

      try {

        if (!batchId) {

          alert(
            "Nhập Batch ID"
          );

          return;
        }

        setLoading(true);

        // Thông tin đầy đủ
        const fullInfo =
          await contract.getBatchFullInfo(
            Number(batchId)
          );

        // Lịch sử trạng thái
        const statusLogs =
          await contract.getHistory(
            Number(batchId)
          );

        // Lịch sử vận chuyển
        const transportLogs =
          await contract.getTransportHistory(
            Number(batchId)
          );

        // Kiểm tra an toàn
        const safe =
          await contract.isProductSafe(
            Number(batchId)
          );

        setBatchInfo(
          fullInfo[0]
        );

        setTransportHistory(
          transportLogs
        );

        setHistory(
          statusLogs
        );

        setSafeInfo({
          isSafe: safe[0],
          message: safe[1]
        });

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
        Tra cứu sản phẩm
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
        onClick={
          lookupProduct
        }
      >
        Tra cứu
      </button>

      {
        loading &&
        <p>
          Đang tải...
        </p>
      }

      {
        batchInfo && (

          <div>

            <hr />

            <h3>
              Thông tin lô hàng
            </h3>

            <p>
              Mã lô:
              {batchInfo.batchCode}
            </p>

            <p>
              Nguồn gốc:
              {batchInfo.origin}
            </p>

            <p>
              Mã vùng trồng:
              {batchInfo.plantingAreaCode}
            </p>

            <p>
              Mã đóng gói:
              {batchInfo.packingHouseCode}
            </p>

            <p>
              Thị trường:
              {batchInfo.exportMarket}
            </p>

            <p>
              Số lượng:
              {
                batchInfo.quantity
                  ?.toString()
              }
            </p>

            <p>
              Trạng thái:
              {
                statusMap[
                  Number(
                    batchInfo.status
                  )
                ]
              }
            </p>

          </div>

        )
      }

      {
        safeInfo && (

          <div>

            <hr />

            <h3>
              Độ an toàn
            </h3>

            <p>

              {
                safeInfo.isSafe
                ? "✅"
                : "❌"
              }

              {" "}

              {
                safeInfo.message
              }

            </p>

          </div>

        )
      }

      {
        history.length > 0 && (

          <div>

            <hr />

            <h3>
              Lịch sử trạng thái
            </h3>

            {
              history.map(
                (item, index) => (

                  <div
                    key={index}
                  >

                    {
                      statusMap[
                        Number(
                          item.status
                        )
                      ]
                    }

                  </div>

                )
              )
            }

          </div>

        )
      }

      {
        transportHistory
          .length > 0 && (

          <div>

            <hr />

            <h3>
              Lịch sử vận chuyển
            </h3>

            {
              transportHistory.map(
                (item, index) => (

                  <div
                    key={index}
                  >

                    <p>
                      Địa điểm:
                      {
                        item.location
                      }
                    </p>

                    <p>
                      Nhiệt độ:
                      {
                        item.temperature
                          ?.toString()
                      }
                      °C
                    </p>

                  </div>

                )
              )
            }

          </div>

        )
      }

    </div>

  );
}