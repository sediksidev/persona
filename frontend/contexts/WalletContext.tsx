"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
    isConnected: boolean;
    address: string;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState("");

    const connect = async () => {
        // Simulate wallet connection
        setIsConnected(true);
        setAddress("0x1234...5678");
    };

    const disconnect = () => {
        setIsConnected(false);
        setAddress("");
    };

    return (
        <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
