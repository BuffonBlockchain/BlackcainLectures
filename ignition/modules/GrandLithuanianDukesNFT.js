const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("GrandLithuanianDukesNFT", (m) => {
  // Define parameters for the deployment
  const baseURI = "https://turquoise-fascinating-elephant-728.mypinata.cloud/ipfs/QmcD9mmwWY8MyrPR7cEiJubNvpRr83rkwyzZaTfKSzz6oi/";

  // Define the contract deployment
  const grandLithuanianDukesNFT = m.contract("GrandLithuanianDukesNFT", [baseURI]);

  return { grandLithuanianDukesNFT };
});
