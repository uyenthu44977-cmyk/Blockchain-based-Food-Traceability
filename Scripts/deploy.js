const hre = require("hardhat");

async function main() {
  const FoodTrace = await hre.ethers.getContractFactory("FoodTrace");

  const foodTrace = await FoodTrace.deploy();

  await foodTrace.waitForDeployment();

  console.log("Contract deployed to:", await foodTrace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});