import { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../../context/WalletContext';

export default function Navbar() {
  const { address } = useContext(WalletContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <nav className="flex justify-between items-center bg-primary text-secondary px-6 py-4">
      <h1 className="text-xl font-bold">Voting Application</h1>
      <span className="text-sm">{address ? `Wallet: ${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}</span>
    </nav>
  );
}