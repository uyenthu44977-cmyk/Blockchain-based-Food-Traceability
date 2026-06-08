// Khai báo thư viện express - dùng để tạo server và các API
const express = require('express');

// Khai báo thư viện mongoose - dùng để kết nối và thao tác với MongoDB
const mongoose = require('mongoose');

// Khai báo thư viện cors - cho phép Frontend gọi API từ Backend
// Nếu không có dòng này, trình duyệt sẽ chặn mọi request từ Frontend
const cors = require('cors');

// Khai báo thư viện ethers - dùng để gọi hàm trong smart contract
const { ethers } = require('ethers');

// Đọc file .env để lấy các biến môi trường như MONGODB_URI, API_KEY...
// Phải gọi dòng này trước khi dùng process.env ở bất kỳ đâu
require('dotenv').config();

// Tạo ứng dụng Express, lưu vào biến "app" để dùng xuyên suốt file
const app = express();

// Bật tính năng CORS cho toàn bộ server
app.use(cors());

// Bật tính năng đọc dữ liệu JSON từ body của request
// Không có dòng này thì req.body sẽ bị undefined
app.use(express.json());

// ============================================
// VIỆC 24: Hàm kết nối MongoDB Atlas
// ============================================

// Khai báo hàm connectDB, từ khóa async cho biết hàm này có chứa
// các thao tác cần chờ (như kết nối database)
const connectDB = async () => {
    try {
        // Gọi mongoose.connect để kết nối tới MongoDB Atlas
        // process.env.MONGODB_URI là đường link lấy từ file .env
        // await = chờ kết nối xong mới chạy dòng tiếp theo
        await mongoose.connect(process.env.MONGODB_URI);

        // In ra terminal nếu kết nối thành công
        console.log("✅ MongoDB database connection established successfully");
    } catch (err) {
        // Nếu kết nối thất bại thì in ra lỗi cụ thể
        console.error("❌ MongoDB connection error:", err);

        // Dừng chương trình vì không có database thì server không hoạt động được
        process.exit(1);
    }
};

// Gọi hàm connectDB ngay khi file này được chạy
connectDB();

// ============================================
// VIỆC 29: Middleware xác thực API Key
// Middleware là hàm chạy trước khi request đến API thật
// Dùng để kiểm tra xem request có hợp lệ không
// ============================================
const apiKeyMiddleware = (req, res, next) => {
    // req.headers chứa các thông tin meta của request
    // Lấy giá trị của header tên là 'x-api-key'
    const apiKey = req.headers['x-api-key'];

    // Nếu không có API key trong header, hoặc API key không khớp với
    // giá trị API_KEY trong file .env thì từ chối request
    if (!apiKey || apiKey !== process.env.API_KEY) {
        // Trả về lỗi 401 - có nghĩa là "chưa được xác thực"
        return res.status(401).json({
            success: false,
            message: "❌ Không có quyền truy cập. API key không hợp lệ!"
        });
    }

    // Nếu API key hợp lệ thì cho request đi tiếp vào API
    // next() là hàm có sẵn của Express, gọi nó để chuyển sang bước tiếp theo
    next();
};

// ============================================
// Khai báo các Model (cấu trúc dữ liệu)
// ============================================

// Nạp model BatchMetadata từ file BatchMetadata.js trong thư mục models
const BatchMetadata = require('./models/BatchMetadata');

// Định nghĩa Schema cho collection ScanLog
// Collection này lưu lại mỗi lần có người quét QR
const ScanLogSchema = new mongoose.Schema({
    batchId: { type: Number, required: true },    // ID của lô hàng bị quét
    scannedAt: { type: Date, default: Date.now }, // Thời điểm quét, mặc định là thời điểm hiện tại
    ipAddress: { type: String }                   // Địa chỉ IP của thiết bị quét
});

// Đăng ký Schema trên với MongoDB, tạo ra Model tên ScanLog
const ScanLog = mongoose.model('ScanLog', ScanLogSchema);

// ============================================
// Cấu hình kết nối Blockchain
// CONTRACT_ADDRESS và CONTRACT_ABI để trống vì contract chưa được deploy
// Điền vào sau khi Ynhi deploy contract lên Sepolia
// ============================================

// Địa chỉ của smart contract trên mạng Sepolia, lấy từ file .env
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

// ABI là danh sách các hàm có trong smart contract
// Frontend và Backend cần ABI để biết cách gọi đúng hàm
// Đọc ABI từ file artifacts/FoodTrace.sol/FoodTrace.json
const FoodTraceArtifact = require('../artifacts/contracts/FoodTrace.sol/FoodTrace.json');
const CONTRACT_ABI = FoodTraceArtifact.abi;
// Hàm tạo đối tượng contract để gọi các hàm bên trong nó
function getContract() {
    // Nếu chưa có địa chỉ contract hoặc ABI thì không thể kết nối
    // Trả về null để các API biết là chưa kết nối được blockchain
    if (!CONTRACT_ADDRESS || CONTRACT_ABI.length === 0) return null;

    // Tạo provider - đây là kết nối vào mạng blockchain thông qua Alchemy
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);

    // Tạo và trả về đối tượng contract, dùng để gọi các hàm trong smart contract
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

// ============================================
// VIỆC 25: POST /api/batch/metadata
// API nhận dữ liệu lô hàng từ Frontend và lưu vào MongoDB
// ============================================
app.post('/api/batch/metadata', apiKeyMiddleware, async (req, res) => {
    try {
        // req.body chứa dữ liệu JSON mà Frontend gửi lên
        // Dùng destructuring để lấy từng trường ra thành biến riêng
        const { batchId, productName, origin, description, imageUrls, certifications } = req.body;

        // Tạo một document mới theo cấu trúc của BatchMetadata
        const newBatch = new BatchMetadata({ 
            batchId, productName, origin, 
            description, imageUrls, certifications 
        });

        // Lưu document vào MongoDB, await để chờ lưu xong
        await newBatch.save();

        // Trả về status 201 (tạo mới thành công) kèm dữ liệu vừa lưu
        res.status(201).json({ 
            success: true, 
            message: "✅ Đã lưu thông tin lô hàng thành công!", 
            data: newBatch 
        });
    } catch (error) {
        // Ví dụ lỗi hay gặp: batchId bị trùng, thiếu trường required
        // status 500 nghĩa là lỗi xảy ra ở phía server
        res.status(500).json({ 
            success: false, 
            message: "❌ Lỗi khi lưu dữ liệu", 
            error: error.message 
        });
    }
});

// ============================================
// VIỆC 26: GET /api/batch/:id
// API tra cứu thông tin một lô hàng theo ID
// :id là tham số trên URL, ví dụ /api/batch/3 thì id = 3
// ============================================
app.get('/api/batch/:id', async (req, res) => {
    try {
        // req.params chứa các tham số trên URL
        // Ví dụ URL là /api/batch/5 thì req.params.id = "5"
        const batchId = req.params.id;

        // Tìm 1 document trong MongoDB có batchId khớp
        // findOne trả về null nếu không tìm thấy
        const metadata = await BatchMetadata.findOne({ batchId: batchId });

        // Nếu không tìm thấy lô hàng trong database
        if (!metadata) {
            // status 404 nghĩa là không tìm thấy tài nguyên
            return res.status(404).json({ 
                success: false, 
                message: "❌ Không tìm thấy lô hàng này!" 
            });
        }

        // Thử lấy thêm dữ liệu từ blockchain
        // Hiện tại getContract() trả về null nên onChainData sẽ là null
        // Sau khi contract deploy xong thì phần này mới hoạt động
        let onChainData = null;
        const contract = getContract();
        if (contract) {
            try {
                onChainData = await contract.getBatchFullInfo(batchId);
            } catch (chainError) {
                // Nếu lỗi blockchain thì chỉ ghi log, không dừng server
                console.warn("⚠️ Không lấy được on-chain data:", chainError.message);
            }
        }

        // Trả về cả dữ liệu từ MongoDB lẫn blockchain trong cùng 1 response
        res.status(200).json({
            success: true,
            message: "✅ Đã tìm thấy thông tin lô hàng!",
            data: { 
                metadata,             // Dữ liệu từ MongoDB: tên, ảnh, chứng nhận
                onChain: onChainData  // Dữ liệu từ blockchain: trạng thái, lịch sử vận chuyển
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "❌ Lỗi khi truy xuất dữ liệu!", 
            error: error.message 
        });
    }
});

// ============================================
// VIỆC 27: GET /api/batches/recalled
// API lấy danh sách tất cả lô hàng đã bị thu hồi
// ============================================
app.get('/api/batches/recalled', async (req, res) => {
    try {
        // Lấy danh sách lô thu hồi từ blockchain
        // Hiện tại trả về mảng rỗng vì contract chưa deploy
        let recalledOnChain = [];
        const contract = getContract();
        if (contract) {
            try {
                recalledOnChain = await contract.getRecalledBatches();
            } catch (chainError) {
                console.warn("⚠️ Không lấy được danh sách thu hồi:", chainError.message);
            }
        }

        // Dùng .map() để duyệt qua mảng recalledOnChain
        // Lấy ra trường id của từng phần tử, chuyển sang kiểu Number
        const recalledIds = recalledOnChain.map(b => Number(b.id));

        // Tìm tất cả document trong MongoDB có batchId nằm trong mảng recalledIds
        // $in là toán tử của MongoDB, nghĩa là "thuộc danh sách"
        const metadataList = await BatchMetadata.find({ 
            batchId: { $in: recalledIds } 
        });

        res.status(200).json({
            success: true,
            message: "✅ Danh sách lô hàng đã thu hồi",
            data: { 
                onChain: recalledOnChain, // Thông tin thu hồi từ blockchain
                metadata: metadataList    // Thông tin sản phẩm từ MongoDB
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "❌ Lỗi khi lấy danh sách thu hồi!", 
            error: error.message 
        });
    }
});

// ============================================
// VIỆC 28: POST /api/trace/scan
// API ghi nhận mỗi lần người dùng quét mã QR
// Nếu 1 lô hàng bị quét quá 100 lần trong 1 giờ thì cảnh báo hàng giả
// ============================================
app.post('/api/trace/scan', async (req, res) => {
    try {
        // Lấy batchId từ body của request
        const { batchId } = req.body;

        // Lấy địa chỉ IP của thiết bị gửi request
        // x-forwarded-for xuất hiện khi chạy trên server thật (Render)
        // req.socket.remoteAddress là IP trực tiếp khi test trên máy local
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Tạo và lưu 1 bản ghi quét mới vào MongoDB
        await new ScanLog({ batchId, ipAddress }).save();

        // Tính thời điểm 1 tiếng trước so với hiện tại
        // Date.now() trả về millisecond, 60*60*1000 = 1 tiếng tính theo millisecond
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Đếm số lần lô hàng này bị quét trong vòng 1 tiếng gần nhất
        // $gte là toán tử MongoDB, nghĩa là "lớn hơn hoặc bằng" (>=)
        const recentScans = await ScanLog.countDocuments({ 
            batchId, 
            scannedAt: { $gte: oneHourAgo }
        });

        // So sánh số lần quét với ngưỡng 100, lưu kết quả vào biến boolean
        const isSuspicious = recentScans > 100;

        res.status(200).json({
            success: true,
            message: "✅ Đã ghi nhận lượt quét QR",
            data: {
                batchId,
                totalScansLastHour: recentScans,
                // Toán tử 3 ngôi: nếu isSuspicious = true thì trả về chuỗi cảnh báo
                // nếu isSuspicious = false thì trả về null
                warning: isSuspicious 
                    ? `⚠️ Lô hàng bị quét ${recentScans} lần/giờ, nghi ngờ hàng giả!` 
                    : null
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "❌ Lỗi khi ghi nhận quét QR!", 
            error: error.message 
        });
    }
});

// ============================================
// Khởi chạy server
// ============================================

// Lấy số cổng từ biến môi trường PORT trong file .env
// Nếu không có thì dùng cổng 5000 làm mặc định
// Khi deploy lên Render, Render tự cấp cổng qua biến PORT
const PORT = process.env.PORT || 5000;

// Bắt đầu lắng nghe request trên cổng PORT
// Khi server sẵn sàng thì in ra dòng thông báo trong terminal
app.listen(PORT, () => console.log(`🚀 Server đang chạy trên cổng: ${PORT}`));