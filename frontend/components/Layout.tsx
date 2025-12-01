import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { WalletProvider } from "@/contexts/WalletContext";

interface LayoutProps {
    children: ReactNode;
    currentPage?: "home" | "register" | "use-cases" | "how-to";
    maxWidth?: "2xl" | "4xl" | "5xl" | "6xl" | "7xl";
}

export default function Layout({ children, currentPage, maxWidth = "7xl" }: LayoutProps) {
    const maxWidthClass = {
        "2xl": "max-w-2xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
    }[maxWidth];

    return (
        <WalletProvider>
            <div className="min-h-screen bg-gray-50">
                <Header currentPage={currentPage} containerWidth={maxWidthClass} />
                <div className={`mx-auto ${maxWidthClass} px-6`}>
                    {children}
                </div>
                <Footer containerWidth={maxWidthClass} />
            </div>
        </WalletProvider>
    );
}
