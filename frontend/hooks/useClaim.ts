import { contractsConfig as cfg } from "@/services/contracts/config";
import { useFheDecryption } from "@/services/fhevm/useFhevmContext";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export function useClaim() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<{
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

  const { refetch: refetchClaimCount } = useReadContract({
    address: mockAddress as `0x${string}`,
    abi: mockAbi,
    functionName: "getClaimCount",
    args: [account.address as `0x${string}`],
    query: { enabled: false },
  });

  const claimReward = async () => {
    setIsClaiming(true);
    setClaimResult(null);
    setDecryptedCount(null);

    try {
      writeContract({
        address: mockAddress as `0x${string}`,
        abi: mockAbi,
        functionName: "claimReward",
      });
    } catch (err) {
      console.error("Error claiming:", err);
      setClaimResult({
        success: false,
        message:
          err instanceof Error ? err.message : "Claim transaction failed",
      });
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    if (isConfirmed && isClaiming) {
      setClaimResult({
        success: true,
        message: "Claim submitted successfully! Decrypt to see if it counted.",
      });
      setIsClaiming(false);
    }
  }, [isConfirmed, isClaiming]);

  useEffect(() => {
    if (writeError && isClaiming) {
      setClaimResult({
        success: false,
        message: "Claim transaction failed. Please try again.",
      });
      setIsClaiming(false);
    }
  }, [writeError, isClaiming]);

  const decryptClaimCount = async () => {
    if (!account.address) return;

    setIsDecrypting(true);
    try {
      const result = await refetchClaimCount();

      if (!result.data) {
        setClaimResult({
          success: false,
          message: "No claim count found. Please claim first.",
        });
        setIsDecrypting(false);
        return;
      }

      const encryptedCount = result.data as string;
      const decrypted = await userDecrypt([encryptedCount], mockAddress);

      if (!decrypted || !decrypted[encryptedCount]) {
        setClaimResult({
          success: false,
          message: "Failed to decrypt claim count",
        });
        setIsDecrypting(false);
        return;
      }

      const count = String(decrypted[encryptedCount]);
      setDecryptedCount(count);
    } catch (err) {
      console.error("Error decrypting claim count:", err);
      setClaimResult({
        success: false,
        message: err instanceof Error ? err.message : "Decryption failed",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    claimReward,
    isClaiming: isClaiming || isConfirming,
    claimResult,
    decryptClaimCount,
    isDecrypting,
    decryptedCount,
  };
}
