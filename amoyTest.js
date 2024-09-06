require("dotenv").config();
const { ethers } = require("hardhat");
const BUILD = require("./artifacts/contracts/Lock.sol/Lock.json");
const ABI = BUILD.abi;

async function main() {
  const [signer] = await ethers.getSigners();

  const contractAddress = "0x775abFCda5D2fEA7ec1a6B6Fd8313145132EF285";

  const contract = new ethers.Contract(contractAddress, ABI, signer);

  const owner = await contract.owner();
  console.log("Owner of the contract:", owner);

  try {
    const tx = await contract.withdraw();
    await tx.wait();
    console.log("Withdrawal successful");
  } catch (error) {
    if (error.message.includes("You can't withdraw yet")) {
      console.log("Error caught: You can't withdraw yet. This is expected behavior.");
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

main().catch((error) => {
  console.error("Error:", error);
});
