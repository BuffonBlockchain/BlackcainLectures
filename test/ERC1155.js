const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("SimpleBatchMintERC1155NFT", function () {
  async function deploySimpleBatchMintFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const SimpleBatchMintERC1155NFT = await ethers.getContractFactory("SimpleBatchMintERC1155NFT");
    const nftContract = await SimpleBatchMintERC1155NFT.deploy();

    return { nftContract, owner, otherAccount };
  }

  describe("Minting", function () {
    it("Should mint 10 NFTs", async function () {
      const { nftContract, owner } = await loadFixture(deploySimpleBatchMintFixture);

      // Mint 10 NFTs
      await expect(nftContract.mintBatchNFT(10)).not.to.be.reverted;

      // Check that 10 NFTs were minted correctly
      for (let i = 1; i <= 10; i++) {
        expect(await nftContract.balanceOf(owner.address, i)).to.equal(1);
      }
    });

    it("Should mint 100 NFTs", async function () {
      const { nftContract, owner } = await loadFixture(deploySimpleBatchMintFixture);

      // Mint 100 NFTs
      await expect(nftContract.mintBatchNFT(100)).not.to.be.reverted;

      // Check that 100 NFTs were minted correctly
      for (let i = 1; i <= 100; i++) {
        expect(await nftContract.balanceOf(owner.address, i)).to.equal(1);
      }
    });

    it("Should mint 300 NFTs", async function () {
      const { nftContract, owner } = await loadFixture(deploySimpleBatchMintFixture);

      // Mint 1000 NFTs
      await expect(nftContract.mintBatchNFT(300, { gasLimit: 30000000 })).not.to.be.reverted;

      // Check that 1000 NFTs were minted correctly
      for (let i = 1; i <= 300; i++) {
        expect(await nftContract.balanceOf(owner.address, i)).to.equal(1);
      }
    });
  });
});
