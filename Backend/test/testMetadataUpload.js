const fs = require("fs");
const { uploadJSONToIPFS } =
  require("../services/pinataService");

async function testMetadataUpload() {
  const metadata = JSON.parse(
    fs.readFileSync("./metadata/ri6.json", "utf8")
  );

  const result = await uploadJSONToIPFS(metadata);

  console.log(result);
}

testMetadataUpload();