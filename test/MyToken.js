const { expect } = require("chai");
const { ethers } = require("hardhat");
const decimals = 2;
describe("MyToken", function () {
  let MyToken, myToken, owner, user1, user2, ownerAddress, user1Address;

  beforeEach(async function () {
    MyToken = await ethers.getContractFactory("MyToken");
    [owner, user1, user2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();
    myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
  });

  it("should deploy with the correct owner", async function () {
    expect(await myToken.owner()).to.equal(await owner.getAddress());
  });

  it("should mint initial supply to the owner", async function () {
    const initialSupply = ethers.parseUnits("777", decimals);
    const realSupply = await myToken.balanceOf(ownerAddress);
    console.log(realSupply);
    console.log(initialSupply);
    expect(realSupply).to.equal(initialSupply);
  });

  it("should allow the owner to mint tokens", async function () {
    const mintAmount = ethers.parseUnits("100", decimals);
    await myToken.mint(user1Address, mintAmount);
    expect(await myToken.balanceOf(user1Address)).to.equal(mintAmount);
  });

  it("should not allow non-owners to mint tokens", async function () {
    const mintAmount = ethers.parseUnits("100", decimals);

    try {
      await myToken.connect(user1).mint(user1Address, mintAmount);
    } catch (error) {
      expect(error).to.be.revertedWith("OwnableUnauthorizedAccount");
    }
  });

  it("should have the correct total supply after minting", async function () {
    const initialSupply = ethers.parseUnits("777", decimals);
    const mintAmount = ethers.parseUnits("100", decimals);

    await myToken.mint(user1Address, mintAmount);
    const totalSupply = initialSupply + mintAmount;
    expect(await myToken.totalSupply()).to.equal(totalSupply);
  });

  it("should have the correct total supply after minting", async function () {
    const initialSupply = ethers.parseUnits("777", decimals);
    const mintAmount = ethers.parseUnits("123", decimals);

    await myToken.mint(user1Address, mintAmount);
    const totalSupply = initialSupply + mintAmount;
    const totalSupplyReal = await myToken.totalSupply();
    expect(totalSupplyReal).to.equal(totalSupply);
    console.log(`total supply: ${totalSupplyReal}`);
  });

  it("should emit TokensMinted event when tokens are minted", async function () {
    const mintAmount = ethers.parseUnits("100", 2);
    const tx = await myToken.connect(owner).mint(user1Address, mintAmount);
    const receipt = await tx.wait();

    if (receipt && receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsedLog = myToken.interface.parseLog(log);
          if (parsedLog.name === "TokensMinted") {
            console.log(`TokensMinted Event: To - ${parsedLog.args[0]}, Amount - ${parsedLog.args[1].toString()}`);
          }
        } catch (error) {}
      }
    } else {
      console.log("No events found in the transaction receipt.");
    }

    await expect(tx).to.emit(myToken, "TokensMinted").withArgs(user1Address, mintAmount);
  });

  it("should allow a user to transfer tokens to another user", async function () {
    const transferAmount = ethers.parseUnits("50", decimals);

    // Mint some tokens to user1
    await myToken.mint(user1Address, transferAmount);

    // Transfer tokens from user1 to user2
    await myToken.connect(user1).transfer(user2Address, transferAmount);

    // Check final balances
    const user1Balance = await myToken.balanceOf(user1Address);
    const user2Balance = await myToken.balanceOf(user2Address);

    expect(user1Balance).to.equal(ethers.parseUnits("0", decimals));
    expect(user2Balance).to.equal(transferAmount);
  });

  it("should allow a user to transfer tokens using transferFrom with approval", async function () {
    const initialAmount = ethers.parseUnits("100", decimals);
    const transferAmount = ethers.parseUnits("30", decimals);
    const transferAmount2 = ethers.parseUnits("20", decimals);

    // Mint some tokens to user1
    await myToken.mint(user1Address, initialAmount);

    // Approve user2 to spend tokens on behalf of user1
    await myToken.connect(user1).approve(user2Address, transferAmount);

    // Transfer tokens from user1 to owner using transferFrom by user2
    await myToken.connect(user2).transferFrom(user1Address, user2Address, transferAmount);

    // Check final balances
    const user1Balance = await myToken.balanceOf(user1Address);
    const user2Balance = await myToken.balanceOf(user2Address);
    const allowance = await myToken.allowance(user1Address, user2Address);
    console.log(user1Balance);
    console.log(user2Balance);
    console.log(allowance);
    // Use BigInt arithmetic for comparisons
    expect(user1Balance).to.equal(initialAmount - transferAmount);
    expect(user2Balance).to.equal(transferAmount);
    expect(allowance).to.equal(ethers.parseUnits("0", decimals));
  });
});
