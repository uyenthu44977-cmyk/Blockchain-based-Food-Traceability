/// viết hàm addFarm để admin thêm farm mới, hàm này sẽ gọi hàm addFarm trong smart contract
import toast from "react-hot-toast";

export const addFarm = async (
  contract,
  role,
  farmerAddress,
  farmName
) => {

  try {

    if (role !== "admin") {

      toast.error(
        "Chỉ admin mới thêm farm"
      );

      return;
    }

    const tx =
      await contract.addFarm(
        farmerAddress,
        farmName
      );

    await tx.wait();

    toast.success(
      "Thêm farm thành công"
    );

  } catch (error) {

    toast.error(
      error.reason || "Lỗi"
    );

  }
};

/// viết hàm createBatch để farmer tạo batch mới, hàm này sẽ gọi hàm createBatch trong smart contract
export const createBatch = async (
  contract,
  role,
  name,
  origin,
  certHash
) => {

  try {

    if (role !== "farmer") {

      toast.error(
        "Không phải farmer"
      );

      return;
    }

    const tx =
      await contract.createBatch(
        name,
        origin,
        certHash
      );

    await tx.wait();

    toast.success(
      "Tạo batch thành công"
    );

  } catch (error) {

    toast.error(
      error.reason || "Lỗi"
    );

  }
};

/// viết hàm updateTransport để inspector cập nhật thông tin vận chuyển, hàm này sẽ gọi hàm updateTransport trong smart contract
export const updateTransport = async (
  contract,
  batchId,
  status,
  location,
  temperature
) => {

  try {

    if (!location) {

      toast.error(
        "Thiếu địa điểm"
      );

      return;
    }

    const tx =
      await contract.updateTransport(
        batchId,
        status,
        location,
        temperature
      );

    await tx.wait();

    toast.success(
      "Cập nhật thành công"
    );

  } catch (error) {

    toast.error(
      error.reason || "Lỗi"
    );

  }
};

/// viết hàm recallBatch để inspector thu hồi batch, hàm này sẽ gọi hàm recallBatch trong smart contract
export const recallBatch = async (
  contract,
  batchId,
 reason
) => {

  try {

    const tx =
      await contract.recallBatch(
        batchId,
        reason
      );

    await tx.wait();

    toast.success(
      "Đã thu hồi batch"
    );

  } catch (error) {

    toast.error(
      error.reason || "Lỗi"
    );

  }
};

/// viết hàm getBatchInfo để lấy thông tin batch, hàm này sẽ gọi hàm getBatchInfo trong smart contract
import axios from "axios";

export const getBatchInfo = async (
  contract,
  batchId
) => {

  try {

    // blockchain
    const result =
      await contract.getBatchFullInfo(
        batchId
      );

    // backend
    const response =
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/batch/${batchId}`
      );

    return {
      blockchain: result,
      metadata: response.data
    };

  } catch (error) {

    console.log(error);

  }
};

/// viết hàm isProductSafe để kiểm tra sản phẩm có an toàn hay không, hàm này sẽ gọi hàm isProductSafe trong smart contract
export const isProductSafe = async (
  contract,
  batchId
) => {

  try {

    const result =
      await contract.isProductSafe(
        batchId
      );

    return {
      safe: result[0],
      message: result[1]
    };

  } catch (error) {

    console.log(error);

  }
};