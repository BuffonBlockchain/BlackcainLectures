const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleBatchMintERC1155NFT", (m) => {
  // Define the base URI for the NFTs metadata
  const baseURI = "https://example.com/api/token/{id}.json";

  // Define the contract deployment
  const simpleBatchMintERC1155NFT = m.contract("SimpleBatchMintERC1155NFT");

  return { simpleBatchMintERC1155NFT };
});
