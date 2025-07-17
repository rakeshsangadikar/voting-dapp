import { config as dotenvConfig } from "dotenv";
import "@nomiclabs/hardhat-ethers";
import { LOCAL_CHAIN_ID, HOLESKY_CHAIN_ID, HOLESKY_RPC_URL, WALLET_PRIVATE_KEY } from "./lib/constant";

dotenvConfig();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: LOCAL_CHAIN_ID || 1337,
    },
    holesky: {
      url: HOLESKY_RPC_URL,
      accounts: [WALLET_PRIVATE_KEY],
      chainId: parseInt(HOLESKY_CHAIN_ID, 10) || 17000,
    },
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test",
  },
};
