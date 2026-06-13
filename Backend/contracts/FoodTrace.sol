// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
contract FoodTrace is Ownable, AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    constructor() Ownable(msg.sender) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(INSPECTOR_ROLE, msg.sender);
    // Khởi tạo ngưỡng nhiệt cho từng loại sầu riêng
    tempThresholds[DurianType.Ri6] = TempThreshold(13, 15);
    tempThresholds[DurianType.Monthong] = TempThreshold(12, 14);
    tempThresholds[DurianType.MusangKing] = TempThreshold(10, 12);
}
    
    uint256 public constant MAX_TRANSPORT_DAYS = 10;
// 1. CÁC TRẠNG THÁI CỦA SẢN PHẨM
    enum Status {
        Created,         // Tạo lô hàng     
        Harvested,       // Thu hoạch
        Processing,      // Sơ chế
        Packed,           // Đóng gói + dán QR
        Transporting,    // Vận chuyển nội địa
        Delivered,       // Bàn giao doanh nghiệp xuất khẩu
        Recalled         // Thu hồi lô hàng
    }
    enum DurianType {
    Ri6,
    Monthong,
    MusangKing
}
// 2. CẤU TRÚC DỮ LIỆU
    struct Batch {
        uint256 id;
        string batchCode;
        DurianType durianType;
        string origin;
        string plantingAreaCode;
        string packingHouseCode;
        string exportMarket;
        string certHash;
        string certType;
        uint256 quantity;
        Status status;
        address farmer;
        uint256 harvestedAt;
        uint256 packedAt;
        uint256 deliveredAt;
        bool isActive;
        bytes32 productHash;
        bool certified;
        address certifiedBy;
        uint256 certifiedAt;
        bool hasTemperatureViolation; 
    }

    struct Farm {
        string name;
        bool isVerified;
    }
    struct StatusLog {
        Status status;
        uint256 timestamp;
        address actor;}
    struct TransportRecord {
        Status status; // trạng thái hiện tại
        string location; // địa điểm
        int temperature; // nhiệt độ
        uint256 timestamp; // thời gian cập nhật
        address operator; // người cập nhật
    }
    struct TempThreshold {
        int8 minTemp;
        int8 maxTemp;
    }
// 3. BIẾN LƯU TRỮ
    mapping(address => Farm) public farms;          
    mapping(uint256 => Batch) public batches; 
    mapping(address => uint256[]) public farmerBatches;       
    mapping(uint256 => StatusLog[]) public history;
    mapping(uint256 => TransportRecord[]) public transportHistory;
    mapping(uint256 => string) public recallReasons;
    mapping(DurianType => TempThreshold) public tempThresholds;
    address[] public farmList;
    uint256 public batchCounter;
    modifier batchExists(uint256 _batchId) {
    require(_batchId > 0 && _batchId <= batchCounter, "Batch does not exist");
    _;
    }
// 4. EVENTS
    event FarmAdded(address indexed farmer, string name);
    event BatchCreated(uint256 batchId, string batchCode, address farmer);
    event BatchCertified(uint256 batchId, address inspector);
    event BatchPacked(uint256 batchId);
    event TransportUpdated(
        uint256 batchId,
        string location,
        int temperature,
        Status status
    );
    event StatusUpdated(uint256 batchId, Status newStatus);
    event TemperatureViolation(
        uint256 batchId,
        int temperature,
        string warning
    );
    event BatchRecalled(uint256 indexed batchId, string reason);
    event TempThresholdUpdated(DurianType indexed durianType, int8 minTemp, int8 maxTemp);
 // 5. QUẢN LÍ PHÂN QUYỀN   
    function addFarm(address _farmer, string memory _name) external onlyOwner {
        require(!farms[_farmer].isVerified, "Farm already exists");
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
    // Thêm thanh tra
    function addInspector(address _inspector)
    external
    onlyOwner
    {
    _grantRole(INSPECTOR_ROLE, _inspector);
    }
    // Xóa thanh tra
    function removeInspector(address _inspector)
    external
    onlyOwner
    {
    _revokeRole(INSPECTOR_ROLE, _inspector);
    }
    // Kiểm tra role của ví
    function getMyRole(address _user)
        external
        view
        returns (string memory)
    {
        if (hasRole(DEFAULT_ADMIN_ROLE, _user)) {
            return "ADMIN";
        }
        if (hasRole(INSPECTOR_ROLE, _user)) {
            return "INSPECTOR";
        }
        if (hasRole(FARMER_ROLE, _user)) {
            return "FARMER";
        }
        return "CONSUMER";
    }
// 6. QUẢN LÍ LÔ HÀNG
    //Tạo lô hàng
    function createBatch(
        string memory _batchCode,
        DurianType _durianType,
        string memory _origin,
        string memory _plantingAreaCode,
        string memory _packingHouseCode,
        string memory _exportMarket,
        string memory _certHash,
        string memory _certType,
        uint256 _quantity
    ) external {
        require(hasRole(FARMER_ROLE, msg.sender), "Not farmer role");
        require(_quantity > 0, "Invalid quantity");
    require(
        bytes(_batchCode).length > 0,
        "Batch code required"
    );
    require(
        bytes(_certType).length > 0,
        "Certificate type required"
    );
    require(
        bytes(_certHash).length > 0,
        "Certificate file required"
    );
    require(
        bytes(_origin).length > 0,
        "Origin required"
    );
    require(
        bytes(_plantingAreaCode).length > 0,
        "Planting area code required"
    );
    require(
        bytes(_packingHouseCode).length > 0,
        "Packing house code required"
    );
    require(
        bytes(_exportMarket).length > 0,
        "Export market required"
    );
        batchCounter++;
        bytes32 pHash = keccak256(
            abi.encodePacked(batchCounter, msg.sender, block.timestamp)
        );
        batches[batchCounter] = Batch({
            id: batchCounter,
            batchCode: _batchCode,
            durianType: _durianType,
            origin: _origin,
            plantingAreaCode: _plantingAreaCode,
            packingHouseCode: _packingHouseCode,
            exportMarket: _exportMarket,
            certHash: _certHash,
            certType: _certType,
            quantity: _quantity,
            status: Status.Created,
            farmer: msg.sender,
            harvestedAt: 0,
            packedAt: 0,
            deliveredAt: 0,
            isActive: true,
            productHash: pHash,
            certified: false,
            certifiedBy: address(0),
            certifiedAt: 0,
            hasTemperatureViolation: false
        });
        // Lưu batch vào danh sách của farmer
        farmerBatches[msg.sender].push(batchCounter);
        history[batchCounter].push(
            StatusLog(Status.Created, block.timestamp, msg.sender ));
        emit BatchCreated(batchCounter, _batchCode, msg.sender);
        }
    // Đóng gói
    function markPacked(uint256 _batchId) external batchExists(_batchId) {
    require(
        batches[_batchId].farmer == msg.sender,
        "Not batch owner"
    );
    require(
    hasRole(FARMER_ROLE, msg.sender),
    "Not farmer role"
    );
    require(
    batches[_batchId].packedAt == 0,
    "Already packed"
    );
    require(
    batches[_batchId].status ==
    Status.Processing,
    "Batch not in packet stage"
    );
    batches[_batchId].packedAt = block.timestamp;
    batches[_batchId].status = Status.Packed;
    history[_batchId].push(
        StatusLog(
            Status.Packed,
            block.timestamp,
            msg.sender
        )
    );
    emit BatchPacked(_batchId);
    }
    //Chứng nhận lô hàng
    function certifyBatch(uint256 _batchId) external batchExists(_batchId) {
        require(
        batches[_batchId].status == Status.Packed,
        "Batch not in processing stage"
        );
        require(
        batches[_batchId].packedAt > 0,
        "Batch not packed yet"
        );
        require(
        batches[_batchId].isActive,
        "Batch inactive"
        );
        require(
        hasRole(INSPECTOR_ROLE, msg.sender),
        "Inspector only"
        );

        require(
        !batches[_batchId].certified,
        "Already certified"
        );
        batches[_batchId].certified = true;
        batches[_batchId].certifiedBy = msg.sender;
        batches[_batchId].certifiedAt = block.timestamp;
    emit BatchCertified(
    _batchId,
    msg.sender
    );
    }
    // Cập nhật trạng thái
    function updateStatus(uint256 _batchId, Status _newStatus) external batchExists(_batchId) {
        require(hasRole(FARMER_ROLE, msg.sender), "Not farmer role");
        require( batches[_batchId].farmer == msg.sender, "Not batch owner" );
        require(batches[_batchId].isActive, "Batch is inactive");
       Status current = batches[_batchId].status;
        // Kiểm tra thứ tự trạng thái
        if (current == Status.Created) {
            require(_newStatus == Status.Harvested, "Must transition to Harvested first");
        } else if (current == Status.Harvested) {
            require(_newStatus == Status.Processing, "Must transition to Processing first");
        } else if (current == Status.Packed) {
            require(batches[_batchId].certified, "Batch has not been certified by an inspector");
            require(_newStatus == Status.Transporting, "Must transition to Transporting first");
        } else if (current == Status.Transporting) {
            require(_newStatus == Status.Delivered, "Must transition to Delivered first");
        } else {
            revert("Cannot update to this status");
        }
        if (_newStatus == Status.Harvested) {
            batches[_batchId].harvestedAt =
                block.timestamp;
        }
        batches[_batchId].status = _newStatus;
        if (_newStatus == Status.Delivered) {
            batches[_batchId].deliveredAt =
                block.timestamp;
        }
        history[_batchId].push(
            StatusLog(_newStatus, block.timestamp, msg.sender)
        );
        emit StatusUpdated(
        _batchId,
        _newStatus
);
    }
    // Thu hồi lô hàng
    function recallBatch(
        uint256 _batchId,
        string memory _reason
    ) external batchExists(_batchId)  {
        // Kiểm tra quyền: Chỉ farmer của lô hàng hoặc admin mới được thu hồi
        require(
            batches[_batchId].farmer == msg.sender ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
            hasRole(INSPECTOR_ROLE, msg.sender),
            "Unauthorized recall"
        );
        // Kiểm tra lô hàng còn hoạt động
        require(batches[_batchId].isActive, "Batch is inactive");
        require(bytes(_reason).length > 0, "Recall reason required");
        // Chuyển trạng thái sang Recalled
        batches[_batchId].status = Status.Recalled;
        // Vô hiệu hóa lô hàng
        batches[_batchId].isActive = false;
        // Lưu lý do thu hồi
        recallReasons[_batchId] = _reason;
        // Ghi lịch sử
        history[_batchId].push(
            StatusLog(
                Status.Recalled,
                block.timestamp,
                msg.sender
            )
        );
        // Phát event
        emit BatchRecalled(
            _batchId,
            _reason
        );
    }
//  7. QUẢN LÍ VẬN CHUYỂN
    // Cập nhật vận chuyển
    function updateTransport(uint256 _batchId,  
                            string memory _location, 
                            int _temperature) external batchExists(_batchId) {
        if (transportHistory[_batchId].length > 0) {
        require(
        block.timestamp >
        transportHistory[_batchId][
            transportHistory[_batchId].length - 1
        ].timestamp + 1 hours,
        "Too frequent"
        );
        }
        require(
        batches[_batchId].status ==
        Status.Transporting,
        "Not transporting"
        );
        require(
        batches[_batchId].packedAt > 0,
        "Batch not packed yet"
        );
        require(
        batches[_batchId].certified,"Batch has not been certified by an inspector"
        );
        //Bảo mật
        require(hasRole(FARMER_ROLE, msg.sender),"Not farmer role");
        require( batches[_batchId].farmer == msg.sender, "Not batch owner");
        // Kiểm tra lô hàng còn hiệu lực
        require(batches[_batchId].isActive, "Batch is inactive");
        // Kiểm tra địa điểm
        require(bytes(_location).length > 0, "Location required");
        //Tạo record vận chuyển mới
        TransportRecord memory record =
            TransportRecord({status: Status.Transporting, 
                            location: _location, 
                            temperature: _temperature, 
                            timestamp: block.timestamp, 
                            operator: msg.sender});
        // Lưu lịch sử vận chuyển
        transportHistory[_batchId].push(record);
        // Kiểm tra nhiệt độ
        checkTemperatureViolation(_batchId, _temperature);
        // Phát event
        emit TransportUpdated(_batchId, _location, _temperature, Status.Transporting);
    }
    // Kiểm tra vi phạm nhiệt độ
    function checkTemperatureViolation(uint256 _batchId, int _temperature) internal {
        DurianType dType = batches[_batchId].durianType;
        TempThreshold memory th = tempThresholds[dType];
        if (_temperature < th.minTemp || _temperature > th.maxTemp) {
            batches[_batchId].hasTemperatureViolation = true;
        string memory warning = string(abi.encodePacked(
            "Unsafe temperature for ",
            uint8(dType) == 0 ? "Ri6" : (uint8(dType) == 1 ? "Monthong" : "MusangKing")
        ));
        emit TemperatureViolation(_batchId, _temperature, warning);
        }
    }
    function setTempThreshold(DurianType _type, int8 _min, int8 _max) external onlyOwner {
        require(_min < _max, "Invalid threshold");
        tempThresholds[_type] = TempThreshold(_min, _max);
        emit TempThresholdUpdated(_type, _min, _max);
}  
// 8. TRUY XUẤT VÀ XÁC THỰC SẢN PHẨM   
    // Tạo QR code cho sản phẩm
     function getQRCode(uint256 _batchId) public view batchExists(_batchId) returns (bytes32) {
      
        return batches[_batchId].productHash;
    }
    // Người dùng kiểm tra sản phẩm
    function checkProduct(uint256 _batchId, bytes32 _qrHash)
        external 
        view batchExists(_batchId)
        returns (
            bool isReal,
            string memory batchCode,
            string memory origin,
            string memory certHash,
            Status status,
            address farmer
        )
        {
        
        Batch memory b = batches[_batchId];
        if (
            !b.isActive ||
            _qrHash != b.productHash
        ) {
        return (false, "", "", "", Status.Created, address(0));
        }
        return (
            true,                          
            b.batchCode,
            b.origin,
            b.certHash,
            b.status,
            b.farmer
        );
        }
    // Kiểm tra độ an toàn
    function isProductSafe(uint256 _batchId)
        external 
        view batchExists(_batchId)
        returns (
            bool isSafe,
            string memory message)
    {
        Batch memory b = batches[_batchId];
        // Kiểm tra xem lô hàng có bị thu hồi hoặc ngắt hoạt động không
        if (
            !b.isActive ||
            b.status == Status.Recalled
        ) {
            return (
                false,
                string(abi.encodePacked("Batch recalled. Reason: ",recallReasons[_batchId] ) ) );
        }
        // Kiểm tra toàn bộ lịch sử vận chuyển
        if (b.hasTemperatureViolation) {
            return (false, "Temperature violation detected during transport");
        }
        if (
        b.deliveredAt > 0 &&
        b.deliveredAt >
        b.packedAt +
        MAX_TRANSPORT_DAYS * 1 days
        )
        {
        return (
            false,
            "Transport duration exceeded limit"
        );
    }   
        return (true, "Safe product");
    }

// 9. TRA CỨU THÔNG TIN 
    // Xem lịch sử trạng thái
    function getHistory(uint256 _batchId)
        external view batchExists(_batchId)
        returns (StatusLog[] memory)
    {
        return history[_batchId];
    }
    // Xem lịch sử vận chuyển
    function getTransportHistory(uint256 _batchId)
    external
    view batchExists(_batchId)
    returns (TransportRecord[] memory)
    {
    return transportHistory[_batchId];
    }
    // Xem thông tin đầy đủ lô hàng
    function getBatchFullInfo(uint256 _batchId)
        external 
        view batchExists(_batchId)
        returns (
            Batch memory batchInfo,
            TransportRecord[] memory transportLogs,
            string memory recallReason)
    {
        return (
            batches[_batchId],
            transportHistory[_batchId],
            recallReasons[_batchId]
        );
    }
    // Danh sách batch của farmer
    function getFarmerBatches(address _farmer)
    external
    view
    returns (uint256[] memory)
{
    return farmerBatches[_farmer];
}
    // Danh sách tất cả batch trong hệ thống
    function getAllBatches()
    external
    view
    returns (Batch[] memory)
{
    Batch[] memory allBatches =
        new Batch[](batchCounter);

    for (uint256 i = 1; i <= batchCounter; i++) {
        allBatches[i - 1] = batches[i];
    }

    return allBatches;
}
    // Danh sách tất cả các trang trại 
    function getAllFarms() external view returns (address[] memory) {
        return farmList;
    }
    // Thông tin trang trại
    function getFarmInfo(address _farmer)
    external
    view
    returns (
        string memory farmName,
        bool verified
    )
{
    Farm memory f = farms[_farmer];
    return (
        f.name,
        f.isVerified
    );
}
    // Kiểm tra trạng thái hoạt động
    function isProductValid(uint256 _batchId) external view  batchExists(_batchId) returns (bool) {
        return batches[_batchId].isActive;
    }
}
