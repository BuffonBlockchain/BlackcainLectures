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

  it("should allow a user to purchase an NFT with the correct price", async function () {
    const tokenId = 0; // ID for the first NFT
    const tokenPrice = await grandLithuanianDukesNFT.nfts(tokenId).then((nft) => nft.price); // Fetch price of tokenId 0

    // User1 purchases NFT with the correct price
    await expect(grandLithuanianDukesNFT.connect(user1).purchaseNFT(tokenId, { value: tokenPrice }))
      .to.emit(grandLithuanianDukesNFT, "Transfer") // Expect a Transfer event to be emitted
      .withArgs(owner.address, user1.address, tokenId);

    // Verify that the owner of the NFT is now user1
    const newOwner = await grandLithuanianDukesNFT.ownerOf(tokenId);
    expect(newOwner).to.equal(user1.address);
  });

  it("should revert if a user sends incorrect value for NFT purchase", async function () {
    const tokenId = 1; // ID for the second NFT
    const incorrectPrice = ethers.parseEther("0.01"); // Incorrect price

    // User1 tries to purchase NFT with incorrect price
    await expect(grandLithuanianDukesNFT.connect(user1).purchaseNFT(tokenId, { value: incorrectPrice })).to.be.revertedWith("Incorrect native token value sent.");
  });

  it("should revert if the NFT is already purchased", async function () {
    const tokenId = 2; // ID for the third NFT
    const tokenPrice = await grandLithuanianDukesNFT.nfts(tokenId).then((nft) => nft.price); // Fetch price of tokenId 2

    // User1 purchases NFT with the correct price
    await grandLithuanianDukesNFT.connect(user1).purchaseNFT(tokenId, { value: tokenPrice });

    // User2 tries to purchase the same NFT
    await expect(grandLithuanianDukesNFT.connect(user2).purchaseNFT(tokenId, { value: tokenPrice })).to.be.revertedWith("NFT already purchased.");
  });

  it("should revert if a user tries to purchase an NFT with an invalid token ID", async function () {
    const invalidTokenId = 999; // Invalid token ID, does not exist

    // User1 tries to purchase an NFT with an invalid token ID
    await expect(grandLithuanianDukesNFT.connect(user1).purchaseNFT(invalidTokenId, { value: ethers.parseEther("1") })).to.be.revertedWith("Invalid token ID");
  });

  it("should allow the owner to withdraw all native tokens from the contract", async function () {
    const tokenId = 0; // ID for the first NFT
    const tokenPrice = await grandLithuanianDukesNFT.nfts(tokenId).then((nft) => nft.price); // Fetch price of tokenId 0

    // User1 purchases NFT with the correct price to add balance to the contract
    await grandLithuanianDukesNFT.connect(user1).purchaseNFT(tokenId, { value: tokenPrice });

    // Get initial balances of the contract and owner
    const contractBalanceBefore = await ethers.provider.getBalance(grandLithuanianDukesNFT.target); // Use 'target' instead of 'address'
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    // Owner withdraws all native tokens from the contract
    const tx = await grandLithuanianDukesNFT.connect(owner).withdraw();
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    // Calculate gas cost
    const gasUsed = receipt.gasUsed;
    const gasPrice = tx.gasPrice;
    const gasCost = gasUsed * gasPrice;

    // Get final balance of the owner
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    // Check that contract balance is now 0
    const contractBalanceAfter = await ethers.provider.getBalance(grandLithuanianDukesNFT.target); // Use 'target' instead of 'address'
    expect(contractBalanceAfter).to.equal(0);

    // Check that owner's balance increased by the contract's balance before withdrawal minus gas costs
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + contractBalanceBefore - gasCost);
  });

  it("should revert when non-owner tries to withdraw", async function () {
    // User1 tries to call the withdraw function
    await expect(grandLithuanianDukesNFT.connect(user1).withdraw()).to.be.reverted; // Changed to .to.be.reverted
  });
});
