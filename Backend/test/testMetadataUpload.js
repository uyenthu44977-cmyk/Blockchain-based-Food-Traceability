// Import hàm upload JSON
const {
  uploadJSONToIPFS,
} = require("../services/pinataService");

// Thư viện đọc file
const fs = require("fs");

// Hàm upload metadata
async function testMetadataUpload() {

  // Đọc file coffee.json
  const metadata = JSON.parse(

    fs.readFileSync(
      "./metadata/vegetable.json"
    )

  );

  // Upload metadata lên IPFS
  const result =
    await uploadJSONToIPFS(metadata);

  // In kết quả
  console.log(result);
}

// Chạy hàm
testMetadataUpload();

