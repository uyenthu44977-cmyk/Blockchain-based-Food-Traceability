const mongoose = require("mongoose");

const certificateSchema =
new mongoose.Schema({

  certType: String,

  certName: String,     //tên file uploaded

  certHash: String,

  uploadedBy: String,   // Ví Admin

  farmerWallet: String, // Ví Farmer

  issueDate: Date,

  expiryDate: Date,


  // batch được farmer sử dụng
  batchId: {
    type: Number,
    default: null
  },

  batchCode: {
    type: String,
    default: ""
  },

  // trạng thái duyệt
  status: {
    type: String,
    enum: [
      "UNUSED",
      "PENDING",
      "APPROVED",
      "REJECTED"
    ],
    default: "UNUSED"
  },

  inspectorWallet: {
    type: String,
    default: ""
  },

  rejectedReason: {
    type: String,
    default: ""
  },

  approvedAt: Date,

  rejectedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports =
mongoose.model(
"Certificate",
certificateSchema
);