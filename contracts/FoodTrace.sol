// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol"; 
contract FoodTrace is Ownable, AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    // 1. CÁC TRẠNG THÁI CỦA SẢN PHẨM
    enum Status {
        Created,      
        Harvested,    
        Processing,   
        Transporting, 
        Delivered,    
        Recalled      
    }
    // 2. THÔNG TIN LÔ HÀNG
    struct Batch {
        uint256 id;
        string name;           
        string origin;         
        string certHash;       
        Status status;
        address farmer;        
        uint256 harvestedAt;
        bool isActive;
        bytes32 productHash; 
    }
    // 3. THÔNG TIN TRANG TRẠI
    struct Farm {
        string name;
        bool isVerified;
    }
    // 4. LƯU TRỮ DỮ LIỆU 
    mapping(address => Farm) public farms;           
    mapping(uint256 => Batch) public batches;        
    mapping(bytes32 => bool) public qrUsed; 
    mapping(uint256 => bool) public batchSold;
    address[] public farmList;
    uint256 public batchCounter;
    // LỊCH SỬ TRẠNG THÁI
     struct StatusLog {
        Status status;
        uint256 timestamp;
        address actor;
    }
    mapping(uint256 => StatusLog[]) public history;
    // Lưu thông tin vận chuyển
    struct TransportRecord {
        Status status; // trạng thái hiện tại
        string location; // địa điểm
        int temperature; // nhiệt độ
        uint256 timestamp; // thời gian cập nhật
        address operator; // người cập nhật
    }

    // Lưu lịch sử vận chuyển của từng lô hàng
    mapping(uint256 => TransportRecord[])
        public transportHistory;
    // SỰ KIỆN
    event FarmAdded(address indexed farmer, string name);
    event BatchCreated(uint256 batchId, string name, address farmer);
    event ProductSold(uint256 batchId, string qrCode, address buyer);
    event ProductRecalled(uint256 batchId, string reason);
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(INSPECTOR_ROLE, msg.sender);
    }
    // Event cập nhật vận chuyển
    event TransportUpdated(
        uint256 batchId,
        string location,
        int temperature,
        Status status
    );

    // Event cảnh báo nhiệt độ
    event TemperatureViolation(
        uint256 batchId,
        int temperature,
        string warning
    );
    // Chủ hệ thống thêm trang trại 
    function addFarm(address _farmer, string memory _name) external onlyOwner {
        require(!farms[_farmer].isVerified, "Trang trai da ton tai");
        farms[_farmer] = Farm({
            name: _name,
            isVerified: true
        }); 
        farmList.push(_farmer);
       _grantRole(FARMER_ROLE, _farmer);
        emit FarmAdded(_farmer, _name);
    }
    // Xóa trang trại 
    function removeFarm(address _farmer) external onlyOwner {
        farms[_farmer].isVerified = false;
         _revokeRole(FARMER_ROLE, _farmer);
    }
   // Tạo lô hàng mới 
    function createBatch(
        string memory _name,
        string memory _origin,
        string memory _certHash
    ) external {
        require(hasRole(FARMER_ROLE, msg.sender), "Not farmer role");
        batchCounter++;
        bytes32 pHash = keccak256(
            abi.encodePacked(batchCounter, msg.sender, block.timestamp)
        );
        batches[batchCounter] = Batch({
            id: batchCounter,
            name: _name,
            origin: _origin,
            certHash: _certHash,
            status: Status.Created,
            farmer: msg.sender,
            harvestedAt: block.timestamp,
            isActive: true,
             productHash: pHash
        });
        emit BatchCreated(batchCounter, _name, msg.sender);
    }
    //Thanh tra
    function certifyBatch(uint256 _batchId, string memory _certHash) external {
        require(hasRole(INSPECTOR_ROLE, msg.sender), "Chi than tra moi duoc chung nhan");
        batches[_batchId].certHash = _certHash;
    }
    // Tạo QR code cho sản phẩm
     function getQRCode(uint256 _batchId) public view returns (bytes32) {
        return batches[_batchId].productHash;
    }
    function useQRCode(uint256 _batchId, bytes32 _qrHash) internal {
        require(!qrUsed[_qrHash], "QR da su dung");
        qrUsed[_qrHash] = true;
    }
    // Bán sản phẩm
    function sellProduct(
        uint256 _batchId,
        bytes32 _qrHash,
        address _buyer
    ) external {
        require(batches[_batchId].farmer == msg.sender, "Khong co quyen ban");
        require(batches[_batchId].isActive, "San pham da bi thu hoi");
        require(_qrHash == batches[_batchId].productHash, "Ma QR khong hop le");
        require(!qrUsed[_qrHash], "QR da duoc su dung"); 
        require(!batchSold[_batchId], "Lo hang da ban roi");
        useQRCode(_batchId, _qrHash);
        batchSold[_batchId] = true;
        batches[_batchId].status = Status.Delivered; 
        history[_batchId].push(  
            StatusLog(Status.Delivered, block.timestamp, msg.sender)
        );
        emit ProductSold(_batchId, _qrHash, _buyer);
    }
    // Người dùng kiểm tra sản phẩm
    function checkProduct(uint256 _batchId, bytes32 _qrHash) 
        external 
        view 
        returns (
            bool isReal,
            string memory productName,
            string memory origin,
            string memory certHash,
            Status status,
            address farmer
        )
    {
        Batch memory b = batches[_batchId];
         if (!b.isActive || _qrHash != b.productHash) {
            return (false, "", "", "", Status.Created, address(0));
        }
        return (
            true,                           
            b.name,
            b.origin,
            b.certHash,
            b.status,
            b.farmer
        );
    }
    //Cập nhật trạng thái
    function updateStatus(uint256 _batchId, Status _newStatus) external {
        require(hasRole(FARMER_ROLE, msg.sender), "Khong phai chu lo hang");
        require(batches[_batchId].isActive, "Lo hang khong con hieu luc");
       Status current = batches[_batchId].status;
        // Kiểm tra thứ tự trạng thái
        if (current == Status.Created) {
            require(_newStatus == Status.Harvested, "Phai chuyen sang Harvested truoc");
        } else if (current == Status.Harvested) {
            require(_newStatus == Status.Processing, "Phai chuyen sang Processing truoc");
        } else if (current == Status.Processing) {
            require(_newStatus == Status.Transporting, "Phai chuyen sang Transporting truoc");
        } else if (current == Status.Transporting) {
            require(_newStatus == Status.Delivered, "Phai chuyen sang Delivered truoc");
        } else {
            revert("Khong the cap nhat trang thai nay");
        }
        batches[_batchId].status = _newStatus;
        history[_batchId].push(
            StatusLog(_newStatus, block.timestamp, msg.sender)
        );
    }
     // Cập nhật vận chuyển
    function updateTransport(uint256 _batchId, Status _status, string memory _location, int _temperature) external {
        // Kiểm tra lô hàng còn hiệu lực
        require(batches[_batchId].isActive, "Lo hang khong ton tai");
        // Kiểm tra địa điểm
        require(bytes(_location).length > 0, "Location required");
        // Tạo record vận chuyển mới
        TransportRecord memory record =
            TransportRecord({status: _status, location: _location, temperature: _temperature, timestamp: block.timestamp, operator: msg.sender});
        // Lưu lịch sử vận chuyển
        transportHistory[_batchId].push(record);
        // Cập nhật trạng thái lô hàng
        batches[_batchId].status = _status;
        // Kiểm tra nhiệt độ
        checkTemperatureViolation(_batchId, _temperature);
        // Phát event
        emit TransportUpdated(_batchId, _location, _temperature, _status);
    }
    // Kiểm tra vi phạm nhiệt độ
    function checkTemperatureViolation(uint256 _batchId, int _temperature) internal {
        // Giả sử nhiệt độ an toàn là từ 0 đến 10 độ C
        if (_temperature < 0 || _temperature > 10) {
            emit TemperatureViolation(_batchId, _temperature, "Nhiet do khong an toan");
        }
    }
    //Thu hồi sản phẩm
    function recallProduct(uint256 _batchId, string memory _reason) external {
        require(batches[_batchId].farmer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Khong co quyen");
        batches[_batchId].status = Status.Recalled;
        batches[_batchId].isActive = false;
        emit ProductRecalled(_batchId, _reason);
    }
    // Xem danh sách
    function getHistory(uint256 _batchId)
        external
        view
        returns (StatusLog[] memory)
    {
        return history[_batchId];
    }
    function getAllFarms() external view returns (address[] memory) {
        return farmList;
    }
    function isProductValid(uint256 _batchId) external view returns (bool) {
        return batches[_batchId].isActive;
    }
    
}