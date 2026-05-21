// Import hàm uploadToIPFS từ pinataService
const { uploadToIPFS } = require("../services/pinataService");

// Hàm test upload ảnh
async function testUpload() {

  // Upload ảnh trong thư mục uploads
  const result = await uploadToIPFS(
    "./uploads/coffee.jpg"
  );

  // In kết quả ra terminal
  console.log(result);
}

// Chạy hàm
testUpload();