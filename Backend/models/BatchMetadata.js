// Bước 1: Gọi thư viện mongoose để làm việc với Database
const mongoose = require('mongoose');

// Bước 2: Định nghĩa "mẫu đơn" (Schema) cho lô hàng
const BatchMetadataSchema = new mongoose.Schema({
    // Số ID của lô hàng (để nối với Blockchain)
    batchId: { type: Number, required: true, unique: true },
    
    // Tên sản phẩm
    productName: { type: String, required: true },
    
    // Nguồn gốc (Sản xuất ở đâu)
    origin: { type: String, required: true },
    
    // Mô tả chi tiết về sản phẩm
    description: { type: String },
    
    // Danh sách các đường link hình ảnh (mảng các chuỗi chữ)
    imageUrls: [{ type: String }],
    
    // Các chứng nhận (Organic, VietGAP...)
    certifications: [{ type: String }],
    
    // Ngày tạo (tự động lấy ngày hiện tại)
    createdAt: { type: Date, default: Date.now }
});

// Bước 3: Xuất cái mẫu này ra để các file khác có thể sử dụng
module.exports = mongoose.model('BatchMetadata', BatchMetadataSchema);