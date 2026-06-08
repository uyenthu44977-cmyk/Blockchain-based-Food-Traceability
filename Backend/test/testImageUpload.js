const { uploadImageToIPFS } =
  require("../services/pinataService");

async function testImageUpload() {

  const result =
    await uploadImageToIPFS(
      "./uploads/logan_certificate.webp"
    );

  // In CID và URL ra màn hình
  console.log(result);

}

testImageUpload();