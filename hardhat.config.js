
// require("@nomiclabs/hardhat-ethers");
// require("dotenv").config();

import { config as dotenvConfig } from "dotenv";
import "@nomiclabs/hardhat-ethers";

dotenvConfig();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    holesky: {
      url: process.env.NEXT_PUBLIC_RPC_URL,
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY],
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10) || 17000,
    },
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test",
  },
};
