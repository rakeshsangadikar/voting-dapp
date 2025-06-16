import { ethers } from "ethers";
require("dotenv").config();
import VotingArtifact from "../artifacts/contracts/Voting.sol/Voting.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const READ_ONLY_PROVIDER = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID, 10) || 17000;

export async function getProvider() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not available");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  // Check correct network (optional but recommended)
  const { chainId } = await provider.getNetwork();
  if (chainId !== CHAIN_ID) {
    throw new Error(`Please connect to the correct network (Chain ID ${CHAIN_ID})`);
  }

  return provider;
}

export async function getContract() {
  const provider = await getProvider();
  const signer = provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, VotingArtifact.abi, signer);
}

//  Contract with read-only provider for view functions
export async function getReadOnlyContract() {
  return new ethers.Contract(CONTRACT_ADDRESS, VotingArtifact.abi, READ_ONLY_PROVIDER);
}

export async function hasAlreadyVoted() {
  const provider = await getProvider();
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  const vc = new ethers.Contract(CONTRACT_ADDRESS, VotingArtifact.abi, provider);
  return await vc.hasVoted(address);
}
