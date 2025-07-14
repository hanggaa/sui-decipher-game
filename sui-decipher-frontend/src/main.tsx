// file: src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getFullnodeUrl } from '@mysten/sui/client';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import '@mysten/dapp-kit/dist/index.css';
import App from './App.tsx';

// Create a query client for React Query
const queryClient = new QueryClient();

// Configure the SUI network (testnet, devnet, or mainnet)
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>
);