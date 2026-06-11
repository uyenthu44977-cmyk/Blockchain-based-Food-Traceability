// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
contract FoodTrace is Ownable, AccessControl {
    constructor() Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(INSPECTOR_ROLE, msg.sender);
}
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    uint256 public constant MAX_TRANSPORT_DAYS = 10;
    // 1. CÁC TRẠNG THÁI CỦA SẢN PHẨM
    enum Status {
        Created,         // Tạo lô hàng     
        Harvested,       // Thu hoạch
        Processing,      // Sơ chế + đóng gói + dán QR
        Transporting,    // Vận chuyển nội địa
        Delivered,       // Bàn giao doanh nghiệp xuất khẩu
        Recalled         // Thu hồi lô hàng
    }
    enum DurianType {
    Ri6,
    Dona,
    MusangKing
}
    // 2. THÔNG TIN LÔ HÀNG
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
    }
    // 3. THÔNG TIN TRANG TRẠI
    struct Farm {
        string name;
        bool isVerified;
    }
    // 4. LƯU TRỮ DỮ LIỆU
    mapping(address => Farm) public farms;          
    mapping(uint256 => Batch) public batches; 
    // Danh sách batch của từng farmer
    mapping(address => uint256[]) public farmerBatches;       
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
    event BatchCreated(uint256 batchId, string batchCode, address farmer);
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
   // Tạo lô hàng mới
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
            harvestedAt: block.timestamp,
            packedAt: 0,
            deliveredAt: 0,
            isActive: true,
            productHash: pHash,
            certified: false,
            certifiedBy: address(0),
            certifiedAt: 0
        });
        // Lưu batch vào danh sách của farmer
        farmerBatches[msg.sender].push(batchCounter);
        history[batchCounter].push(
            StatusLog(Status.Created, block.timestamp, msg.sender ));
        emit BatchCreated(batchCounter, _batchCode, msg.sender);
        }
    // Thời gian đóng gói
    function markPacked(uint256 _batchId)
    external
    {
    require(
        batches[_batchId].farmer == msg.sender,
        "Not batch owner"
    );

    batches[_batchId].packedAt =
        block.timestamp;
    }
    //Thanh tra
    function certifyBatch(uint256 _batchId)
    external
    {
        require(
        _batchId > 0 &&
        _batchId <= batchCounter,
        "Batch khong ton tai"
        );
        
        require(
        hasRole(INSPECTOR_ROLE, msg.sender),
        "Chi thanh tra moi duoc chung nhan"
        );

        require(
        !batches[_batchId].certified,
        "Da duoc chung nhan"
        );
        batches[_batchId].certified = true;
        batches[_batchId].certifiedBy = msg.sender;
        batches[_batchId].certifiedAt = block.timestamp;
    }
    // Tạo QR code cho sản phẩm
     function getQRCode(uint256 _batchId) public view returns (bytes32) {
        require(
        _batchId > 0 &&
        _batchId <= batchCounter,
        "Batch khong ton tai"
    );    
        return batches[_batchId].productHash;
    }
    
    // Người dùng kiểm tra sản phẩm
    function checkProduct(uint256 _batchId, bytes32 _qrHash)
        external
        view
        returns (
            bool isReal,
            string memory batchCode,
            string memory origin,
            string memory certHash,
            Status status,
            address farmer
        )
    {
        require(
                _batchId > 0 &&
                _batchId <= batchCounter,
                "Batch khong ton tai"
                );
        
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
    //Cập nhật trạng thái
    function updateStatus(uint256 _batchId, Status _newStatus) external {
        require(_batchId > 0 &&
            _batchId <= batchCounter,
            "Batch khong ton tai"
                );
        require(hasRole(FARMER_ROLE, msg.sender), "Not farmer role");
        require( batches[_batchId].farmer == msg.sender, "Khong phai chu lo hang" );
        require(batches[_batchId].isActive, "Lo hang khong con hieu luc");
       Status current = batches[_batchId].status;
        // Kiểm tra thứ tự trạng thái
        if (current == Status.Created) {
            require(_newStatus == Status.Harvested, "Phai chuyen sang Harvested truoc");
        } else if (current == Status.Harvested) {
            require(_newStatus == Status.Processing, "Phai chuyen sang Processing truoc");
        } else if (current == Status.Processing) {
            require( batches[_batchId].certified,"Batch chua duoc thanh tra duyet" );
            require(_newStatus == Status.Transporting, "Phai chuyen sang Transporting truoc");
        } else if (current == Status.Transporting) {
            require(_newStatus == Status.Delivered, "Phai chuyen sang Delivered truoc");
        } else {
            revert("Khong the cap nhat trang thai nay");
        }
        batches[_batchId].status = _newStatus;
        if (_newStatus == Status.Delivered) {
            batches[_batchId].deliveredAt =
            block.timestamp;
        }
        history[_batchId].push(
            StatusLog(_newStatus, block.timestamp, msg.sender)
        );
    }
     // Cập nhật vận chuyển
    function updateTransport(uint256 _batchId,  
                            string memory _location, 
                            int _temperature) external {
        require(
                _batchId > 0 &&
                _batchId <= batchCounter,
                "Batch khong ton tai"
         );
        require(
batches[_batchId].status == Status.Processing ||
            batches[_batchId].status == Status.Transporting,
            "Trang thai khong hop le"
        );
        require(
        batches[_batchId].certified,"Batch chua duoc thanh tra duyet"
        );
        //Bảo mật
        require(hasRole(FARMER_ROLE, msg.sender),"Not farmer role");
        require( batches[_batchId].farmer == msg.sender, "Khong phai chu lo hang");
        // Kiểm tra lô hàng còn hiệu lực
        require(batches[_batchId].isActive, "Lo hang khong ton tai");
        // Kiểm tra địa điểm
        require(bytes(_location).length > 0, "Location required");
        // Tạo record vận chuyển mới
        TransportRecord memory record =
            TransportRecord({status: Status.Transporting, 
                            location: _location, 
                            temperature: _temperature, 
                            timestamp: block.timestamp, 
                            operator: msg.sender});
        // Lưu lịch sử vận chuyển
        transportHistory[_batchId].push(record);
        // Cập nhật trạng thái lô hàng
        batches[_batchId].status = Status.Transporting;
        history[_batchId].push(StatusLog(Status.Transporting,
                                        block.timestamp,
                                        msg.sender )
                                        );
        // Kiểm tra nhiệt độ
        checkTemperatureViolation(_batchId, _temperature);
        // Phát event
        emit TransportUpdated(_batchId, _location, _temperature, Status.Transporting);
    }
    // Kiểm tra vi phạm nhiệt độ
    function checkTemperatureViolation(uint256 _batchId, int _temperature) internal {
       if (_temperature < 12 || _temperature > 15) {
        emit TemperatureViolation(
            _batchId,
            _temperature,
            "Unsafe storage temperature for durians"
        );
    }
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
    // Lưu lý do thu hồi
    mapping(uint256 => string) public recallReasons;
    // Event thu hồi lô hàng
    event BatchRecalled(
        uint256 indexed batchId,
        string reason
    );
    // THU HỒI LÔ HÀNG
    function recallBatch(
        uint256 _batchId,
        string memory _reason
    ) external {
        require(_batchId > 0 &&
                _batchId <= batchCounter,
                "Batch khong ton tai"
                );
        // Kiểm tra quyền: Chỉ farmer của lô hàng hoặc admin mới được thu hồi
        require(
            batches[_batchId].farmer == msg.sender ||
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
            hasRole(INSPECTOR_ROLE, msg.sender),
            "Unauthorized recall"
        );
        // Kiểm tra lô hàng còn hoạt động
        require(batches[_batchId].isActive, "Lo hang da o trang thai khong hoat dong");
        require(bytes(_reason).length > 0, "Ly do thu hoi khong duoc de trong");
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
    // TRA CỨU TOÀN BỘ THÔNG TIN
    function getBatchFullInfo(uint256 _batchId)
        external
        view
        returns (
            Batch memory batchInfo,
            TransportRecord[] memory transportLogs,
            string memory recallReason)
    {
        require(
            _batchId > 0 &&
            _batchId <= batchCounter,
            "Batch khong ton tai"
        );
        return (
            batches[_batchId],
            transportHistory[_batchId],
            recallReasons[_batchId]
        );
    }
    // KIỂM TRA ĐỘ AN TOÀN
    function isProductSafe(uint256 _batchId)
        external
        view
        returns (
            bool isSafe,
            string memory message)
    {
        require(_batchId > 0 &&
                _batchId <= batchCounter,
                "Batch khong ton tai"
                );
        Batch memory b = batches[_batchId];
        // Kiểm tra xem lô hàng có bị thu hồi hoặc ngắt hoạt động không
        if (
            !b.isActive ||
            b.status == Status.Recalled
        ) {
            return (
                false,
                string(abi.encodePacked("Lo hang da bi thu hoi. Ly do: ",recallReasons[_batchId] ) ) );
        }
        // Kiểm tra toàn bộ lịch sử vận chuyển
        TransportRecord[] memory records = transportHistory[_batchId];
        for (uint256 i = 0; i < records.length; i++) {
        if (
        records[i].temperature < 12 ||
        records[i].temperature > 15
        ) {
        return (
            false,
            "San pham khong an toan do vi pham nhiet do bao quan sau rieng"
        );
    }
}
    if (
    b.deliveredAt > 0 &&
    b.deliveredAt >
    b.harvestedAt +
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

        // Lấy danh sách ID batch của farmer
    function getFarmerBatches(address _farmer)
    external
    view
    returns (uint256[] memory)
{
    return farmerBatches[_farmer];
}
    // Lấy toàn bộ batch trong hệ thống
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
function getTransportHistory(uint256 _batchId)
    external
    view
    returns (TransportRecord[] memory)
{
    return transportHistory[_batchId];
}
}
