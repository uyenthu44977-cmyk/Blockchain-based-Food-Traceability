// Import thư viện đọc biến môi trường từ file .env
require("dotenv").config();

// Thư viện gọi API
const axios = require("axios");

// Thư viện xử lý upload file
const FormData = require("form-data");

// Thư viện đọc file từ máy tính
const fs = require("fs");

// Lấy API key từ file .env
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY =
  process.env.PINATA_SECRET_API_KEY;

// Hàm upload file lên IPFS
// filePath: đường dẫn file cần upload
async function uploadToIPFS(filePath) {

  try {

    // Tạo object form-data để gửi file
    const data = new FormData();

    // Đọc file từ máy và thêm vào request
    data.append("file", fs.createReadStream(filePath));

    // Gửi request upload lên Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity,

        // Header chứa API key xác thực
        headers: {
          ...data.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key:
            PINATA_SECRET_API_KEY,
        },
      }
    );

    console.log("Upload thành công!");

    // Trả về dữ liệu Pinata trả về
    return response.data;

  } catch (error) {

    console.log("Lỗi upload IPFS!");

    // Nếu lỗi từ server Pinata
    if (error.response) {
      console.log(error.response.data);

    } else {

      // Lỗi khác
      console.log(error.message);
    }
  }
}


// Hàm upload ảnh lên IPFS
// filePath: đường dẫn ảnh cần upload
async function uploadImageToIPFS(filePath) {

  try {

    // Gọi lại hàm uploadToIPFS đã viết ở việc 32
    const result = await uploadToIPFS(filePath);

    // Lấy CID ảnh
    const cid = result.IpfsHash;

    // Tạo URL gateway để xem ảnh
    const imageUrl =
      `https://gateway.pinata.cloud/ipfs/${cid}`;

    console.log("Upload ảnh thành công!");

    // Trả về object chứa CID và URL
    return {
      cid,
      imageUrl,
    };

  } catch (error) {

    console.log("Lỗi upload ảnh!");

    console.log(error.message);
  }
}



// Hàm upload JSON metadata lên IPFS
// jsonData: object JSON cần upload
async function uploadJSONToIPFS(jsonData) {

  try {

    // Gửi JSON metadata lên Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",

      jsonData,

      {
        headers: {
          pinata_api_key: PINATA_API_KEY,

          pinata_secret_api_key:
            PINATA_SECRET_API_KEY,

          "Content-Type": "application/json",
        },
      }
    );

    console.log("Upload JSON thành công!");

    // Lấy CID metadata
    const cid = response.data.IpfsHash;

    // Tạo URL gateway
    const metadataUrl =
      `https://gateway.pinata.cloud/ipfs/${cid}`;

    // Trả về CID + URL
    return {
      cid,
      metadataUrl,
    };

  } catch (error) {

    console.log("Lỗi upload JSON!");

    if (error.response) {
      console.log(error.response.data);

    } else {
      console.log(error.message);
    }
  }
}

// Export các hàm để file khác có thể sử dụng
module.exports = {
  uploadToIPFS,
  uploadImageToIPFS,
  uploadJSONToIPFS,
};