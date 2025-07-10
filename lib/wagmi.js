import { createConfig, http } from 'wagmi';
import { localhost, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const isLocal = process.env.NEXT_PUBLIC_CHAIN_ID === '1337';
const selectedChain = isLocal ? localhost : sepolia;

export const config = createConfig({
  autoConnect: true,
  chains: [selectedChain],
  connectors: [injected({
    shimDisconnect: true,
  })],
  transports: {
    [selectedChain.id]: http(),
  },
});

