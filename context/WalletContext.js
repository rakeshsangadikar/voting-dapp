import { createContext, useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import Voting from '../contracts/Voting.json';

const CONTRACT_ABI = Voting.abi;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

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
    if (isConnected && address && isAdminFromContract !== undefined) {
      setIsAdmin(isAdminFromContract);
    }
  }, [address, isConnected, isAdminFromContract]);

  return (
    <WalletContext.Provider value={{ address, isConnected, isAdmin }}>
      {children}
    </WalletContext.Provider>
  );
}
