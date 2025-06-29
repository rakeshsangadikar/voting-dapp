import '../styles/globals.css';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../lib/wagmi';
// import { publicProvider } from 'wagmi/providers/public';
import { WalletProvider } from '../context/WalletContext'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../components/Common/Loader';
import { Toaster } from 'react-hot-toast';

// const { publicClient, chains } = configureChains([mainnet], [publicProvider()]);
// const wagmiConfig = createConfig({ autoConnect: true, publicClient });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          {loading && <Loader />}
          <Toaster position="top-center" reverseOrder={false} />
          <Component {...pageProps} />
        </WalletProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}