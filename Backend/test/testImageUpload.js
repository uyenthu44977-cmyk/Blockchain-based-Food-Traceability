const { uploadImageToIPFS } = require("../services/pinataService");

async function testImageUpload() {
  const result = await uploadImageToIPFS(
    "./uploads/Musangkinh_certificate.png"
  );

  console.log(result);
}

testImageUpload();