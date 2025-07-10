import { useEffect, useState } from 'react';
import { useWalletClient, useAccount } from 'wagmi';

/**
 * Safe hook to access wallet client once connected
 */
export function useWalletClientSafe() {
  const { isConnected } = useAccount();
  const { data: client, isLoading } = useWalletClient();
  const [walletClient, setWalletClient] = useState(null);

  useEffect(() => {
    if (isConnected && client) {
      setWalletClient(client);
    } else {
      setWalletClient(null);
    }
  }, [isConnected, client]);

  return walletClient;
}
