// Import hàm upload JSON
const {
  uploadJSONToIPFS,
} = require("./services/pinataService");

// Import thư viện đọc file
const fs = require("fs");

// Hàm test upload metadata
async function testMetadataUpload() {

  // Đọc file coffee.json
  const coffeeData = JSON.parse(
    fs.readFileSync("./metadata/coffee.json")
  );

  // Upload metadata lên IPFS
  const result =
    await uploadJSONToIPFS(coffeeData);

  // In kết quả
  console.log(result);
}

// Chạy hàm
testMetadataUpload();