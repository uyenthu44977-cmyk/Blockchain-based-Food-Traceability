const { uploadImageToIPFS } =
  require("../services/pinataService");

async function testImageUpload() {
  const result =
    await uploadImageToIPFS(
      "./uploads/cashew_certificate.jpg"
    );

  console.log(result);
}

testImageUpload();