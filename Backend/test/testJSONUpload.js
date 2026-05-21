// Import hàm uploadJSONToIPFS
const {
  uploadJSONToIPFS,
} = require("../services/pinataService");

// Hàm test upload metadata JSON
async function testJSONUpload() {

  // Tạo metadata mẫu
  const metadata = {

    productName: "Cà phê Đắk Lắk",

    origin: "Buôn Ma Thuột",

    description:
      "Cà phê organic chất lượng cao",

    certifications: [
      "Organic"
    ],

    imageUrls: [
      "https://gateway.pinata.cloud/ipfs/QmUuBQ4Smm8pLfobvMKCQhfhuCtENfbTkfGdC5A4NMc6Mm"
    ],
  };

  // Upload metadata lên IPFS
  const result =
    await uploadJSONToIPFS(metadata);

  // In kết quả ra terminal
  console.log(result);
}

// Chạy hàm test
testJSONUpload();