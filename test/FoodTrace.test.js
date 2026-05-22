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
      foodTrace.connect(other).createBatch("Thit", "Dong Nai", "cert123")
    ).to.be.revertedWith("Not farmer role");
  });

  it("Verified farmer can create batch", async function () {
    await foodTrace.addFarm(farmer.address, "Farm A");
    await foodTrace.connect(farmer).createBatch("Thit", "Dong Nai", "cert123");

    const batch = await foodTrace.batches(1);
    // batch: [id, name, origin, certHash, status, farmer, harvestedAt, isActive, productHash]
    expect(batch[1]).to.equal("Thit"); // name ở vị trí index 1
  });

  it("Update transport successfully", async function () {
    await foodTrace.addFarm(farmer.address, "Farm A");
    await foodTrace.connect(farmer).createBatch("Thit", "Dong Nai", "cert123");

    const Transporting = 3; // Status.Transporting
    await foodTrace.updateTransport(1, Transporting, "HCM", 2);

    const record = await foodTrace.transportHistory(1, 0);
    expect(record.location).to.equal("HCM");
  });

  it("Recall batch successfully", async function () {
    await foodTrace.addFarm(farmer.address, "Farm A");
    await foodTrace.connect(farmer).createBatch("Rau cu qua", "Lam Dong", "cert456");

    await foodTrace.connect(farmer).recallBatch(1, "E.coli detected");

    const batch = await foodTrace.batches(1);
    // Recalled = 5
    expect(batch[4]).to.equal(5); // status ở vị trí index 4
  });

  it("Unsafe temperature should return unsafe product", async function () {
    await foodTrace.addFarm(farmer.address, "Farm A");
    await foodTrace.connect(farmer).createBatch("Thit", "Dong Nai", "cert123");

    const Transporting = 3;
    await foodTrace.updateTransport(1, Transporting, "HCM", 35);

    const [isSafe, message] = await foodTrace.isProductSafe(1);
    expect(isSafe).to.equal(false);
  });

});