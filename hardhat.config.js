require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 137,
    },
  },
};
