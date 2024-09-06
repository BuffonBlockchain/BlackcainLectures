const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // 1 Year
  const lockedAmount = ethers.parseEther("0.001");

  const Contract = await ethers.getContractFactory("Lock");
  const contract = await Contract.deploy(unlockTime, { value: lockedAmount });
  await contract.deploymentTransaction().wait();

  console.log("Contract deployed to address:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
