import { contractsConfig as cfg } from "@/services/contracts/config";
import { useFheDecryption } from "@/services/fhevm/useFhevmContext";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export function useView() {
  const [isViewing, setIsViewing] = useState(false);
  const [viewResult, setViewResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [decryptedCount, setDecryptedCount] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const account = useAccount();
  const { userDecrypt } = useFheDecryption();
  const mockAddress = cfg.address.mock;
  const mockAbi = cfg.abis.mock;

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const { refetch: refetchViewCount } = useReadContract({
    address: mockAddress as `0x${string}`,
    abi: mockAbi,
    functionName: "getViewCount",
    args: [account.address as `0x${string}`],
    query: { enabled: false },
  });

  const viewContent = async () => {
    setIsViewing(true);
    setViewResult(null);
    setDecryptedCount(null);

    try {
      writeContract({
        address: mockAddress as `0x${string}`,
        abi: mockAbi,
        functionName: "viewContent",
      });
    } catch (err) {
      console.error("Error viewing:", err);
      setViewResult({
        success: false,
        message: err instanceof Error ? err.message : "View transaction failed",
      });
      setIsViewing(false);
    }
  };

  useEffect(() => {
    if (isConfirmed && isViewing) {
      setViewResult({
        success: true,
        message: "View submitted successfully! Decrypt to see if it counted.",
      });
      setIsViewing(false);
    }
  }, [isConfirmed, isViewing]);

  useEffect(() => {
    if (writeError && isViewing) {
      setViewResult({
        success: false,
        message: "View transaction failed. Please try again.",
      });
      setIsViewing(false);
    }
  }, [writeError, isViewing]);

  const decryptViewCount = async () => {
    if (!account.address) return;

    setIsDecrypting(true);
    try {
      const result = await refetchViewCount();

      if (!result.data) {
        setViewResult({
          success: false,
          message: "No view count found. Please view first.",
        });
        setIsDecrypting(false);
        return;
      }

      const encryptedCount = result.data as string;
      const decrypted = await userDecrypt([encryptedCount], mockAddress);

      if (!decrypted || !decrypted[encryptedCount]) {
        setViewResult({
          success: false,
          message: "Failed to decrypt view count",
        });
        setIsDecrypting(false);
        return;
      }

      const count = String(decrypted[encryptedCount]);
      setDecryptedCount(count);
    } catch (err) {
      console.error("Error decrypting view count:", err);
      setViewResult({
        success: false,
        message: err instanceof Error ? err.message : "Decryption failed",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    viewContent,
    isViewing: isViewing || isConfirming,
    viewResult,
    decryptViewCount,
    isDecrypting,
    decryptedCount,
  };
}
