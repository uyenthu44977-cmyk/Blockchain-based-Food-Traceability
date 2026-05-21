// Import hàm uploadImageToIPFS
const {
  uploadImageToIPFS,
} = require("../services/pinataService");

// Hàm test upload ảnh
async function testImageUpload() {

  // Upload ảnh trong thư mục uploads
  const result =
    await uploadImageToIPFS(
      "./uploads/pork.jpg"
    );

  // In kết quả ra terminal
  console.log(result);
}

// Chạy hàm test
testImageUpload();