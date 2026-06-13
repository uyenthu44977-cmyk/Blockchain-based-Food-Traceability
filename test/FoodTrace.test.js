const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FoodTrace Contract", function () {
  let foodTrace;
  let owner, farmer, inspector, other;

  beforeEach(async function () {
    [owner, farmer, inspector, other] = await ethers.getSigners();

    const FoodTrace = await ethers.getContractFactory("FoodTrace");
    foodTrace = await FoodTrace.deploy();
    await foodTrace.waitForDeployment();

    await foodTrace.addFarm(farmer.address, "Farm A");
    await foodTrace.addInspector(inspector.address);
  });

  async function createSampleBatch() {
    await foodTrace.connect(farmer).createBatch(
      "SR2026001",
      0,
      "Dak Lak",
      "MADL001",
      "PHDL001",
      "China",
      "ipfs://cert001",
      "VietGAP",
      2000
    );
  }

  async function moveToTransporting(batchId = 1) {
    await foodTrace.connect(farmer).updateStatus(batchId, 1); // Harvested
    await foodTrace.connect(farmer).updateStatus(batchId, 2); // Processing
    await foodTrace.connect(farmer).markPacked(batchId);
    await foodTrace.connect(inspector).certifyBatch(batchId);
    await foodTrace.connect(farmer).updateStatus(batchId, 4); // Transporting
  }

  async function increaseOneHour() {
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine", []);
  }

  // ROLE & ACCESS CONTROL

  it("Owner can add farm", async function () {
    await foodTrace.addFarm(other.address, "Farm B");

    const farm = await foodTrace.farms(other.address);

    expect(farm.isVerified).to.equal(true);
  });

  it("Owner can add inspector", async function () {
    await foodTrace.addInspector(other.address);

    const role = await foodTrace.getMyRole(other.address);

    expect(role).to.equal("INSPECTOR");
  });

  it("Owner can remove inspector", async function () {
    await foodTrace.removeInspector(inspector.address);

    const role = await foodTrace.getMyRole(inspector.address);

    expect(role).to.equal("CONSUMER");
  });

  it("Owner can remove farm", async function () {
    await foodTrace.removeFarm(farmer.address);

    const farm = await foodTrace.farms(farmer.address);

    expect(farm.isVerified).to.equal(false);
  });

  it("Non-owner cannot add farm", async function () {
    await expect(
      foodTrace.connect(other).addFarm(other.address, "Farm X")
    ).to.be.reverted;
  });

  it("Non-owner cannot add inspector", async function () {
    await expect(
      foodTrace.connect(other).addInspector(other.address)
    ).to.be.reverted;
  });

  // BATCH CREATION

  it("Verified farmer can create batch", async function () {
    await createSampleBatch();

    const batch = await foodTrace.batches(1);

    expect(batch.batchCode).to.equal("SR2026001");
    expect(batch.origin).to.equal("Dak Lak");
    expect(batch.quantity).to.equal(2000);
  });

  it("Non-farmer cannot create batch", async function () {
    await expect(
      foodTrace.connect(other).createBatch(
        "SR2026001",
        0,
        "Dak Lak",
        "MADL001",
        "PHDL001",
        "China",
        "ipfs://cert001",
        "VietGAP",
        2000
      )
    ).to.be.revertedWith("Not farmer role");
  });

  it("Should emit BatchCreated event", async function () {
    await expect(
      foodTrace.connect(farmer).createBatch(
        "SR2026001",
        0,
        "Dak Lak",
        "MADL001",
        "PHDL001",
        "China",
        "ipfs://cert001",
        "VietGAP",
        2000
      )
    ).to.emit(foodTrace, "BatchCreated");
  });

  it("Cannot create batch with zero quantity", async function () {
    await expect(
      foodTrace.connect(farmer).createBatch(
        "SR2026001",
        0,
        "Dak Lak",
        "MADL001",
        "PHDL001",
        "China",
        "ipfs://cert001",
        "VietGAP",
        0
      )
    ).to.be.revertedWith("Invalid quantity");
  });

  // STATUS FLOW
  
  it("Status flow works correctly", async function () {
    await createSampleBatch();

    await foodTrace.connect(farmer).updateStatus(1, 1);
    await foodTrace.connect(farmer).updateStatus(1, 2);

    await foodTrace.connect(farmer).markPacked(1);

    const batch = await foodTrace.batches(1);

    expect(batch.status).to.equal(3);
  });

  it("Cannot skip status transitions", async function () {
    await createSampleBatch();

    await expect(
      foodTrace.connect(farmer).updateStatus(1, 2)
    ).to.be.revertedWith(
      "Must transition to Harvested first"
    );
  });

  it("Only owner farmer can update status", async function () {
    await createSampleBatch();

    await expect(
      foodTrace.connect(other).updateStatus(1, 1)
    ).to.be.reverted;
  });

  it("History should record status changes", async function () {
    await createSampleBatch();

    await foodTrace.connect(farmer).updateStatus(1, 1);
    await foodTrace.connect(farmer).updateStatus(1, 2);
    await foodTrace.connect(farmer).markPacked(1);

    const logs = await foodTrace.getHistory(1);

    expect(logs.length).to.equal(4);
    expect(logs[0].status).to.equal(0);
    expect(logs[1].status).to.equal(1);
    expect(logs[2].status).to.equal(2);
    expect(logs[3].status).to.equal(3);
  });

  // CERTIFICATION

  it("Inspector can certify batch", async function () {
    await createSampleBatch();

    await foodTrace.connect(farmer).updateStatus(1, 1);
    await foodTrace.connect(farmer).updateStatus(1, 2);
    await foodTrace.connect(farmer).markPacked(1);

    await foodTrace.connect(inspector).certifyBatch(1);

    const batch = await foodTrace.batches(1);

    expect(batch.certified).to.equal(true);
    expect(batch.certifiedBy).to.equal(inspector.address);
  });

  it("Non-inspector cannot certify batch", async function () {
    await createSampleBatch();

    await foodTrace.connect(farmer).updateStatus(1, 1);
    await foodTrace.connect(farmer).updateStatus(1, 2);
    await foodTrace.connect(farmer).markPacked(1);

    await expect(
      foodTrace.connect(other).certifyBatch(1)
    ).to.be.revertedWith("Inspector only");
  });

  it("Cannot certify twice", async function () {
    await createSampleBatch();

    await foodTrace.connect(farmer).updateStatus(1, 1);
    await foodTrace.connect(farmer).updateStatus(1, 2);
    await foodTrace.connect(farmer).markPacked(1);

    await foodTrace.connect(inspector).certifyBatch(1);

    await expect(
      foodTrace.connect(inspector).certifyBatch(1)
    ).to.be.revertedWith("Already certified");
  });
  
  // TRANSPORT

  it("Update transport successfully", async function () {
    await createSampleBatch();

    await moveToTransporting();

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "HCM", 13);

    const records =
      await foodTrace.getTransportHistory(1);

    expect(records[0].location).to.equal("HCM");
    expect(records[0].temperature).to.equal(13);
  });

  it("Only batch owner can update transport", async function () {
    await createSampleBatch();

    await moveToTransporting();

    await expect(
      foodTrace
        .connect(other)
        .updateTransport(1, "HCM", 13)
    ).to.be.reverted;
  });

  it("Cannot update transport too frequently", async function () {
    await createSampleBatch();

    await moveToTransporting();

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "HCM", 14);

    await expect(
      foodTrace
        .connect(farmer)
        .updateTransport(1, "Dong Nai", 14)
    ).to.be.revertedWith("Too frequent");
  });

  // TEMPERATURE THRESHOLD
  
  describe("Temperature Threshold Management", function () {
    it("Only owner can set threshold", async function () {
      await expect(
        foodTrace
          .connect(other)
          .setTempThreshold(0, 14, 16)
      ).to.be.reverted;
    });

    it("Owner can set threshold", async function () {
      await foodTrace.setTempThreshold(0, 14, 16);

      const threshold =
        await foodTrace.tempThresholds(0);

      expect(threshold.minTemp).to.equal(14);
      expect(threshold.maxTemp).to.equal(16);
    });

    it("Should emit threshold update event", async function () {
      await expect(
        foodTrace.setTempThreshold(1, 11, 13)
      )
        .to.emit(foodTrace, "TempThresholdUpdated")
        .withArgs(1, 11, 13);
    });

    it("Reject invalid threshold", async function () {
      await expect(
        foodTrace.setTempThreshold(0, 16, 14)
      ).to.be.revertedWith("Invalid threshold");
    });
  });

  // TEMPERATURE VIOLATION
  
  it("Ri6 temperature validation works", async function () {
    await createSampleBatch();

    await moveToTransporting();

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "HCM", 14);

    let safe =
      await foodTrace.isProductSafe(1);

    expect(safe[0]).to.equal(true);

    await increaseOneHour();

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "Hanoi", 35);

    const batch =
      await foodTrace.batches(1);

    expect(batch.hasTemperatureViolation)
      .to.equal(true);

    safe = await foodTrace.isProductSafe(1);

    expect(safe[0]).to.equal(false);
  });

  it("Temperature violation persists forever", async function () {
    await createSampleBatch();

    await moveToTransporting();

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "HCM", 35);

    await increaseOneHour();

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "Hanoi", 14);

    const batch =
      await foodTrace.batches(1);

    expect(batch.hasTemperatureViolation)
      .to.equal(true);

    const result =
      await foodTrace.isProductSafe(1);

    expect(result[0]).to.equal(false);
  });

  it("Should emit temperature violation event", async function () {
    await createSampleBatch();

    await moveToTransporting();

    await expect(
      foodTrace
        .connect(farmer)
        .updateTransport(1, "HCM", 35)
    ).to.emit(foodTrace, "TemperatureViolation");
  });

  // RECALL
  
  it("Farmer can recall batch", async function () {
    await createSampleBatch();

    await foodTrace
      .connect(farmer)
      .recallBatch(
        1,
        "E.coli detected"
      );

    const batch =
      await foodTrace.batches(1);

    expect(batch.status).to.equal(6);
    expect(batch.isActive).to.equal(false);
  });

  it("Inspector can recall batch", async function () {
    await createSampleBatch();

    await foodTrace
      .connect(inspector)
      .recallBatch(
        1,
        "Safety issue"
      );

    const batch =
      await foodTrace.batches(1);

    expect(batch.status).to.equal(6);
  });

  it("Unauthorized user cannot recall batch", async function () {
    await createSampleBatch();

    await expect(
      foodTrace
        .connect(other)
        .recallBatch(
          1,
          "test"
        )
    ).to.be.revertedWith(
      "Unauthorized recall"
    );
  });

  // QR & PRODUCT AUTHENTICATION

  it("QR verification works", async function () {
    await createSampleBatch();

    const qr =
      await foodTrace.getQRCode(1);

    const result =
      await foodTrace.checkProduct(
        1,
        qr
      );

    expect(result[0]).to.equal(true);
    expect(result[1]).to.equal("SR2026001");
  });

  it("Fake QR returns false", async function () {
    await createSampleBatch();

    const fakeHash =
      ethers.keccak256(
        ethers.toUtf8Bytes("fake")
      );

    const result =
      await foodTrace.checkProduct(
        1,
        fakeHash
      );

    expect(result[0]).to.equal(false);
  });

  // VIEW FUNCTIONS

  it("Get farmer batches", async function () {
    await createSampleBatch();

    const batches =
      await foodTrace.getFarmerBatches(
        farmer.address
      );

    expect(batches.length).to.equal(1);
    expect(batches[0]).to.equal(1);
  });

  it("Get all batches", async function () {
    await createSampleBatch();

    const batches =
      await foodTrace.getAllBatches();

    expect(batches.length).to.equal(1);
  });

  it("Get farm info", async function () {
    const farm =
      await foodTrace.getFarmInfo(
        farmer.address
      );

    expect(farm[0]).to.equal("Farm A");
    expect(farm[1]).to.equal(true);
  });

  // BATCH EXISTS MODIFIER

  describe("batchExists Modifier", function () {
    it("Reject batchId = 0", async function () {
      await expect(
        foodTrace.getBatchFullInfo(0)
      ).to.be.revertedWith(
        "Batch does not exist"
      );

      await expect(
        foodTrace.updateStatus(0, 1)
      ).to.be.revertedWith(
        "Batch does not exist"
      );
    });

    it("Reject non-existing batch", async function () {
      await expect(
        foodTrace.getBatchFullInfo(999)
      ).to.be.revertedWith(
        "Batch does not exist"
      );
    });

    it("History uses modifier", async function () {
      await expect(
        foodTrace.getHistory(0)
      ).to.be.revertedWith(
        "Batch does not exist"
      );
    });
  });
});