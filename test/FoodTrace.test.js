const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FoodTrace Contract", function () {

  let foodTrace;
  let owner, farmer, buyer, other;

  beforeEach(async function () {
    [owner, farmer, buyer, other] = await ethers.getSigners();

    const FoodTrace = await ethers.getContractFactory("FoodTrace");
    foodTrace = await FoodTrace.deploy();
    await foodTrace.waitForDeployment();
  });

  it("Owner can add farm", async function () {
    await foodTrace.addFarm(farmer.address, "Farm A");

    const farm = await foodTrace.farms(farmer.address);

    expect(farm.isVerified).to.equal(true);
  });

  it("Non-farmer cannot create batch", async function () {
    await expect(
      foodTrace
        .connect(other)
        .createBatch("Thit", "Dong Nai", "cert123", 0)
    ).to.be.revertedWith("Not farmer role");
  });

  it("Verified farmer can create batch", async function () {
    await foodTrace.addFarm(farmer.address, "Farm A");

    // ProductType.Thit = 0
    await foodTrace
      .connect(farmer)
      .createBatch("Thit", "Dong Nai", "cert123", 0);

    const batch = await foodTrace.batches(1);

    expect(batch.name).to.equal("Thit");
    expect(batch.origin).to.equal("Dong Nai");
  });

  it("Update transport successfully", async function () {

    await foodTrace.addFarm(farmer.address, "Farm A");

    await foodTrace
      .connect(farmer)
      .createBatch("Thit", "Dong Nai", "cert123", 0);

    // Created -> Harvested
    await foodTrace
      .connect(farmer)
      .updateStatus(1, 1);

    // Harvested -> Processing
    await foodTrace
      .connect(farmer)
      .updateStatus(1, 2);

    await foodTrace
      .connect(farmer)
      .updateTransport(1, "HCM", 2);

    const records = await foodTrace.getTransportHistory(1);

    expect(records[0].location).to.equal("HCM");
    expect(records[0].temperature).to.equal(2);
  });

  it("Recall batch successfully", async function () {

    await foodTrace.addFarm(farmer.address, "Farm A");

    // RauCuQua = 1
    await foodTrace
      .connect(farmer)
      .createBatch("Rau cu qua", "Lam Dong", "cert456", 1);

    await foodTrace
      .connect(farmer)
      .recallBatch(1, "E.coli detected");

    const batch = await foodTrace.batches(1);

    expect(batch.status).to.equal(5); // Recalled
    expect(batch.isActive).to.equal(false);
  });

  it("Unsafe temperature should return unsafe product", async function () {

    await foodTrace.addFarm(farmer.address, "Farm A");

    await foodTrace
      .connect(farmer)
      .createBatch("Thit", "Dong Nai", "cert123", 0);

    // Created -> Harvested
    await foodTrace
      .connect(farmer)
      .updateStatus(1, 1);

    // Harvested -> Processing
    await foodTrace
      .connect(farmer)
      .updateStatus(1, 2);

    // Thịt nhưng nhiệt độ 35°C
    await foodTrace
      .connect(farmer)
      .updateTransport(1, "HCM", 35);

    const result = await foodTrace.isProductSafe(1);

    expect(result[0]).to.equal(false);
  });

  it("Inspector can certify batch", async function () {

    await foodTrace.addFarm(farmer.address, "Farm A");

    await foodTrace
      .connect(farmer)
      .createBatch("Thit", "Dong Nai", "cert123", 0);

    await foodTrace.certifyBatch(1, "NEW_CERT");

    const batch = await foodTrace.batches(1);

    expect(batch.certHash).to.equal("NEW_CERT");
  });

  it("Owner can add inspector", async function () {

    await foodTrace.addInspector(other.address);

    const role = await foodTrace.getMyRole(other.address);

    expect(role).to.equal("INSPECTOR");
  });

  it("QR can only be used once when selling", async function () {

    await foodTrace.addFarm(farmer.address, "Farm A");

    await foodTrace
      .connect(farmer)
      .createBatch("Thit", "Dong Nai", "cert123", 0);

    // Đưa tới Delivered
    await foodTrace.connect(farmer).updateStatus(1, 1);
    await foodTrace.connect(farmer).updateStatus(1, 2);
    await foodTrace.connect(farmer).updateStatus(1, 3);
    await foodTrace.connect(farmer).updateStatus(1, 4);

    const qr = await foodTrace.getQRCode(1);

    await foodTrace
      .connect(farmer)
      .sellProduct(1, qr, buyer.address);

    await expect(
      foodTrace
        .connect(farmer)
        .sellProduct(1, qr, buyer.address)
    ).to.be.reverted;
  });

});