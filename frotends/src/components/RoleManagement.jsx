import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export default function RoleManagement() {

  const { contract } =
    useWeb3();

  // =========================
  // LOADING
  // =========================

  const [loading,
    setLoading] =
    useState(false);

  // =========================
  // FARMER
  // =========================

  const [farmerAddress,
    setFarmerAddress] =
    useState("");

  const [farmName,
    setFarmName] =
    useState("");

  // =========================
  // INSPECTOR
  // =========================

  const [inspectorAddress,
    setInspectorAddress] =
    useState("");

  // =========================
  // FARM LIST
  // =========================

  const [farms,
    setFarms] =
    useState([]);

  // =========================
  // ADD FARM
  // =========================

  const addFarm =
    async () => {

      try {

        if (
          !farmerAddress ||
          !farmName
        ) {
          alert(
            "Nhập đầy đủ thông tin"
          );
          return;
        }

        setLoading(true);

        const tx =
          await contract.addFarm(
            farmerAddress,
            farmName
          );

        await tx.wait();

        alert(
          "Thêm Farmer thành công"
        );

        setFarmerAddress("");
        setFarmName("");

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
  // REMOVE FARM
  // =========================

  const removeFarm =
    async () => {

      try {

        if (!farmerAddress) {
          alert(
            "Nhập địa chỉ Farmer"
          );
          return;
        }

        setLoading(true);

        const tx =
          await contract.removeFarm(
            farmerAddress
          );

        await tx.wait();

        alert(
          "Xóa Farmer thành công"
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
  // ADD INSPECTOR
  // =========================

  const addInspector =
    async () => {

      try {

        if (
          !inspectorAddress
        ) {

          alert(
            "Nhập địa chỉ Inspector"
          );

          return;
        }

        setLoading(true);

        const tx =
          await contract.addInspector(
            inspectorAddress
          );

        await tx.wait();

        alert(
          "Thêm Inspector thành công"
        );

        setInspectorAddress("");

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
  // REMOVE INSPECTOR
  // =========================

  const removeInspector =
    async () => {

      try {

        if (
          !inspectorAddress
        ) {

          alert(
            "Nhập địa chỉ Inspector"
          );

          return;
        }

        setLoading(true);

        const tx =
          await contract.removeInspector(
            inspectorAddress
          );

        await tx.wait();

        alert(
          "Xóa Inspector thành công"
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
  // LOAD FARMS
  // =========================

  const loadFarms =
    async () => {

      try {

        setLoading(true);

        const addresses =
          await contract.getAllFarms();

        const farmData =
          await Promise.all(

            addresses.map(
              async (addr) => {

                const info =
                  await contract.getFarmInfo(
                    addr
                  );

                return {
                  address: addr,
                  name: info[0],
                  verified: info[1]
                };
              }
            )

          );

        setFarms(
          farmData
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  return (

    <div>

      <h2>
        Admin Dashboard
      </h2>

      {
        loading &&
        <p>
          Đang xử lý...
        </p>
      }

      <hr />

      <h3>
        Quản lý Farmer
      </h3>

      <input
        placeholder="Địa chỉ Farmer"
        value={farmerAddress}
        onChange={(e) =>
          setFarmerAddress(
            e.target.value
          )
        }
      />

      <br />

      <input
        placeholder="Tên trang trại"
        value={farmName}
        onChange={(e) =>
          setFarmName(
            e.target.value
          )
        }
      />

      <br />

      <button
        onClick={addFarm}
      >
        Add Farm
      </button>

      <button
        onClick={removeFarm}
      >
        Remove Farm
      </button>

      <hr />

      <h3>
        Quản lý Inspector
      </h3>

      <input
        placeholder="Địa chỉ Inspector"
        value={inspectorAddress}
        onChange={(e) =>
          setInspectorAddress(
            e.target.value
          )
        }
      />

      <br />

      <button
        onClick={addInspector}
      >
        Add Inspector
      </button>

      <button
        onClick={removeInspector}
      >
        Remove Inspector
      </button>

      <hr />

      <h3>
        Danh sách trang trại
      </h3>

      <button
        onClick={loadFarms}
      >
        Xem tất cả Farm
      </button>

      {
        farms.map(
          (farm, index) => (

            <div
              key={index}
              style={{
                border:
                  "1px solid #ccc",
                margin:
                  "10px 0",
                padding:
                  "10px"
              }}
            >

              <p>
                <b>Tên:</b>
                {" "}
                {farm.name}
              </p>

              <p>
                <b>Địa chỉ:</b>
                {" "}
                {farm.address}
              </p>

              <p>
                <b>Trạng thái:</b>
                {" "}
                {
                  farm.verified
                  ? "Đã xác thực"
                  : "Chưa xác thực"
                }
              </p>

            </div>

          )
        )
      }

    </div>

  );
}