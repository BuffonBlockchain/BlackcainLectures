const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GrandLithuanianDukesNFT", function () {
  let GrandLithuanianDukesNFT, grandLithuanianDukesNFT, owner, user1, user2, ownerAddress, user1Address;

  // Deploy contract before each test
  beforeEach(async function () {
    GrandLithuanianDukesNFT = await ethers.getContractFactory("GrandLithuanianDukesNFT");
    [owner, user1, user2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();

    // Deploy contract with the base URI for IPFS folder
    grandLithuanianDukesNFT = await GrandLithuanianDukesNFT.deploy("https://turquoise-fascinating-elephant-728.mypinata.cloud/ipfs/QmC9mmwv8MyPR7CEiJubNvPr83rkwyzZTaTfKSzZ6oi/");
    await grandLithuanianDukesNFT.waitForDeployment();
  });

  it("should deploy with the correct owner", async function () {
    expect(await grandLithuanianDukesNFT.owner()).to.equal(ownerAddress);
  });

  it("should mint all NFTs upon deployment", async function () {
    const totalSupply = await grandLithuanianDukesNFT.tokenCounter();
    expect(totalSupply).to.equal(21); // Check if all 21 NFTs are minted
  });

  it("should have the correct token URI for minted NFTs", async function () {
    const tokenId = 0; // First token
    const expectedTokenURI = "https://turquoise-fascinating-elephant-728.mypinata.cloud/ipfs/QmC9mmwv8MyPR7CEiJubNvPr83rkwyzZTaTfKSzZ6oi/1_mindaugas.json";

    expect(await grandLithuanianDukesNFT.tokenURI(tokenId)).to.equal(expectedTokenURI);
  });
});
