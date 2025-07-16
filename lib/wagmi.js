import { createConfig, http } from 'wagmi';
import { localhost, holesky } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const isLocal = Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1337;
const selectedChain = isLocal ? localhost : holesky;

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

