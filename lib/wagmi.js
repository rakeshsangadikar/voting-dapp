import { createConfig, http } from 'wagmi';
import { localhost, holesky } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { HOLESKY_CHAIN_ID } from './constant';

const isLocal = Number(HOLESKY_CHAIN_ID) === 0; 
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

