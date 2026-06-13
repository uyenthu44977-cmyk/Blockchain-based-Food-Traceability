const { uploadImageToIPFS } =
  require("../services/pinataService");

async function testImageUpload() {
  const result =
    await uploadImageToIPFS("./uploads/ri6_certificate.jpg");

  console.log(result);
}

testImageUpload();