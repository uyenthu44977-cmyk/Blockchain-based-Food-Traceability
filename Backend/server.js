// Import các module cần thiết cho Backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Cấu hình để đọc biến môi trường từ file .env

const app = express();

// Cấu hình Middleware xử lý dữ liệu đầu vào
app.use(cors()); // Cho phép truy cập từ các nguồn khác nhau (Frontend)
app.use(express.json()); // Cấu hình để Server có thể đọc dữ liệu định dạng JSON

// Thiết lập kết nối tới MongoDB Atlas (Database)
const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
    .then(() => console.log("✅ MongoDB database connection established successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
// --- TẠO API ĐỂ LƯU THÔNG TIN LÔ HÀNG ---

// 1. Nhập cái mẫu (Model) BatchMetadata vào để server biết cấu trúc dữ liệu
const BatchMetadata = require('./models/BatchMetadata');

// 2. Viết API POST: Khi Frontend gửi dữ liệu lên, server sẽ xử lý tại đây
app.post('/api/batch/metadata', async (req, res) => {
    try {
        // Lấy các dữ liệu mà người dùng đã nhập trên màn hình (như tên, nguồn gốc...) gửi về
        const { batchId, productName, origin, description, imageUrls, certifications } = req.body;

        // Tạo một đối tượng lô hàng mới dựa trên mẫu BatchMetadata
        const newBatch = new BatchMetadata({
            batchId,
            productName,
            origin,
            description,
            imageUrls,
            certifications
        });

        // Lưu đối tượng này vào cơ sở dữ liệu MongoDB Atlas
        await newBatch.save();

        // Nếu lưu thành công, trả về mã 201 (Đã tạo) và thông báo xanh cho người dùng
        res.status(201).json({
            success: true,
            message: "✅ Đã lưu thông tin lô hàng vào database thành công!",
            data: newBatch
        });

    } catch (error) {
        // Nếu có lỗi (ví dụ: trùng ID, thiếu trường bắt buộc), báo lỗi về cho Frontend
        res.status(500).json({
            success: false,
            message: "❌ Lỗi khi lưu dữ liệu",
            error: error.message
        });
    }
});

// --- TẠO API TRUY XUẤT THÔNG TIN LÔ HÀNG THEO ID ---

app.get('/api/batch/:id', async (req, res) => {
    try {
        // 1. Lấy cái ID lô hàng mà người dùng muốn tìm từ địa chỉ web
        const batchId = req.params.id;

        // 2. Vào MongoDB tìm xem có lô hàng nào có batchId này không
        const metadata = await BatchMetadata.findOne({ batchId: batchId });

        // 3. Nếu không tìm thấy lô hàng trong kho
        if (!metadata) {
            return res.status(404).json({
                success: false,
                message: "❌ Không tìm thấy thông tin cho lô hàng này rồi Ny ơi!"
            });
        }

        // 4. Nếu tìm thấy, trả về thông tin đầy đủ cho người xem
        res.status(200).json({
            success: true,
            message: "✅ Đã tìm thấy thông tin lô hàng!",
            data: metadata
        });

    } catch (error) {
        // Báo lỗi nếu có vấn đề gì đó xảy ra khi đang tìm kiếm
        res.status(500).json({
            success: false,
            message: "❌ Lỗi khi truy xuất dữ liệu!",
            error: error.message
        });
    }
});
// Khởi chạy Server Backend trên cổng được chỉ định
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});