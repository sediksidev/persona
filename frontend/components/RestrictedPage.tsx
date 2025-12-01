"use client";

import { useWallet } from "@/contexts/WalletContext";
import { ReactNode } from "react";

interface RestrictedPageProps {
    children: ReactNode;
}

export default function RestrictedPage({ children }: RestrictedPageProps) {
    const { isConnected, connect } = useWallet();

    if (!isConnected) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center py-12">
                <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">Wallet required</h2>
                    <p className="mb-6 text-sm text-gray-600">
                        Please connect your wallet to access this page
                    </p>
                    <button
                        onClick={connect}
                        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Connect wallet
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
