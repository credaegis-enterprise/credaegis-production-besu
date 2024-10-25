require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-ethers");


module.exports = {
  networks: {
    qbft: {
      url: "http://localhost:8001", // Replace <port> with your actual RPC port
      accounts: [
        `c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3`, // Private Key of Account 2
      ],
    },
  },
  solidity: "0.8.27",
};

