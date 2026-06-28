const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const Certificate = require("../models/Certificate");

const router = express.Router();

// lưu file tạm
const upload = multer({
  dest: "uploads/"
});

// Upload Certificate
router.post(
  "/upload-certificate",
  upload.single("file"),
  async (req, res) => {
    try {
      const {
        adminWallet,
        farmerWallet,
        certType,
        issueDate,
        expiryDate
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: "Chưa chọn file"
        });
      }

      // Form gửi Pinata
      const data = new FormData();

      data.append(
        "file",
        fs.createReadStream(req.file.path)
      );

      // Upload lên Pinata
      const pinataRes = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          maxBodyLength: Infinity,
          headers: {
            ...data.getHeaders(),
            pinata_api_key:
              process.env.PINATA_API_KEY,
            pinata_secret_api_key:
              process.env.PINATA_SECRET_API_KEY
          }
        }
      );

      const ipfsHash =
        pinataRes.data.IpfsHash;

      // Lưu MongoDB
      const cert = await Certificate.create({

        certType,

        certName: req.file.originalname,

        certHash: ipfsHash,

        uploadedBy: adminWallet.toLowerCase(),

        farmerWallet: farmerWallet.toLowerCase(),

        issueDate,

        expiryDate

      });

      // Xóa file tạm
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        ipfsHash,
        cert
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: err.message
      });

    }
  }
);

// Lấy danh sách chứng nhận
router.get(
  "/certificates",
  async (req, res) => {
    try {

      const certs =
        await Certificate.find();

      res.json(certs);

    } catch (err) {

      res.status(500).json({
        message: err.message
      });

    }
  }
);
router.get(
  "/farmer/:wallet",
  async (req, res) => {
    try {

      const certs = await Certificate.find({
        farmerWallet: req.params.wallet.toLowerCase()
      });

      res.json(certs);

    } catch (err) {

      res.status(500).json({
        message: err.message
      });

    }
  }
);
module.exports = router;