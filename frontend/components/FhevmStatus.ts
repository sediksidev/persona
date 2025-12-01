import { useMemo } from "react";
import { useFhevmContext } from "../services/fhevm/useFhevmContext";
import { BanIcon, Globe, Loader2 } from "lucide-react";

export default function FhevmStatus() {
  const { status } = useFhevmContext();
  const badgeStyle = useMemo(() => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "loading":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, [status]);

  return (
    <div className="fixed bottom-0 z-50">
      <div
        className={`m-4 inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium ${badgeStyle}`}
      >
        {status === "ready" ? (
          <Globe className="mr-1.5 h-4 w-4" />
        ) : status === "loading" ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : status === "error" ? (
          <BanIcon className="mr-1.5 h-4 w-4" />
        ) : null}
        FHEVM Testnet
      </div>
    </div>
  );
}
