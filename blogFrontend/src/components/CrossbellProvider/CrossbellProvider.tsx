import React from 'react';
import { ConnectKitProvider } from '@crossbell/connect-kit';
import { WagmiConfig } from 'wagmi';
import { createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { createPublicClient, http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 创建 wagmi 配置
const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
});

interface CrossbellProviderProps {
  children: React.ReactNode;
}

export const CrossbellProvider: React.FC<CrossbellProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ConnectKitProvider
          options={{
            appName: "孤芳不自赏博客",
            appDescription: "个人技术博客",
            appUrl: "https://www.gfbzsblog.site",
            appIcon: "https://www.gfbzsblog.site/favicon.ico",
          }}
        >
          {children}
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}; 