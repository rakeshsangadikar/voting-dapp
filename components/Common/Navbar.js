'use client';

import { useWalletManager } from '../../utils/walletManager';
import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function Navbar() {
  const { address, isConnected, isAdmin, walletReady } = useWalletManager();
  const { connectAsync } = useConnect();

  const handleConnect = async () => {
    try {
      await connectAsync({ connector: injected() });
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  if (!walletReady) return null;

  return (
    <nav className="flex justify-between items-center bg-primary text-secondary px-6 py-4">
      <h1 className="text-xl font-bold">Voting Application</h1>

      {isConnected && address ? (
        <div className="flex items-center gap-3">
          <span className="text-sm">
            Wallet: {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {isAdmin && (
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}
