// utils/walletManager.js
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useWalletClient, useReadContract } from 'wagmi';
import Voting from '../contracts/Voting.json';
import { CONTRACT_ADDRESS } from '../lib/constant';

const CONTRACT_ABI = Voting.abi;

export function useWalletManager() {
  const { address, isConnected, status } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { data: client } = useWalletClient();

  const [isAdmin, setIsAdmin] = useState(false);
  const [walletReady, setWalletReady] = useState(false);

  // Admin check via contract
  const { data: isAdminFromContract } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'isAdmin',
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (isConnected && isAdminFromContract !== undefined) {
      setIsAdmin(isAdminFromContract);
    }
  }, [isConnected, isAdminFromContract]);

  // Auto-connect on mount
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (!isConnected && connectors?.length > 0) {
        const injectedConnector = connectors.find(c => c.id === 'injected');
        if (injectedConnector?.ready) {
          try {
            await connectAsync({ connector: injectedConnector });
          } catch (err) {
            console.error('Auto-connect failed:', err);
          }
        }
      }
      setWalletReady(true);
    };

    tryAutoConnect();
  }, [connectAsync, connectors, isConnected]);

  return {
    address,
    isConnected,
    isAdmin,
    walletClient: client,
    walletReady, // becomes true once auto-connect attempt finishes
  };
}
