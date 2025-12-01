"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { FhevmProvider } from "@/services/fhevm/FhevmProvider";


const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [sepolia, mainnet],
        transports: {
            // RPC URL for each chain
            [mainnet.id]: http(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
            ),
            // Sepolia RPC URL (if needed)
            [sepolia.id]: http(
                `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
            ),
        },

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,

        // Required App Info
        appName: "Persona Demo",

        // Optional App Info
        appDescription: "Identity protocol for privacy-first dApps",
        appUrl: "https://persona-protocol.vercel.app", // your app's url
        appIcon: "https://persona-protocol.vercel.app/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider
                    theme="minimal"
                    customTheme={{
                        "--ck-connectbutton-font-size": "14px",
                        "--ck-font-family": "geist, sans-serif",
                        "--ck-connectbutton-font-weight": "400",
                    }}
                    options={{
                        initialChainId: sepolia.id,
                    }}
                >
                    <FhevmProvider>
                        {children}
                    </FhevmProvider>
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
