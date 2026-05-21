require("dotenv").config();
const axios = require("axios");

async function testPinata() {
  try {
    const response = await axios.get(
      "https://api.pinata.cloud/data/testAuthentication",
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key:
            process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    console.log("Kết nối Pinata thành công!");
    console.log(response.data);

  } catch (error) {
    console.log("Lỗi kết nối!");

    if (error.response) {
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

testPinata();