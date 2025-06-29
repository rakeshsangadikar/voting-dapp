import { getPublicClient } from '@wagmi/core';
import { getContract } from 'viem';
import contractJSON from '../contracts/Voting.json';
import { config } from './wagmi'; // adjust path

const CONTRACT_ABI = contractJSON.abi;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// Create a public (read-only) contract instance
export const getReadContract = () => {
  const publicClient = getPublicClient(config);

  return getContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    client: publicClient,
  });
};

/**
 * Create a write-enabled contract instance using a connected walletClient.
 */
export const getWriteContract = (walletClient) => {
  if (!walletClient) {
    alert('Your wallet not connected. \nPlease connect your wallet first');
    throw new Error('Wallet not connected');
  }

  return getContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    client: walletClient,
  });
};
