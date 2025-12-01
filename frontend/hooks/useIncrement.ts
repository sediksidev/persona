import { contractsConfig as cfg } from "@/services/contracts/config";
import { useFheDecryption } from "@/services/fhevm/useFhevmContext";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export function useIncrement() {
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [incrementResult, setIncrementResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [decryptedCounter, setDecryptedCounter] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const account = useAccount();
  const { userDecrypt } = useFheDecryption();
  const mockAddress = cfg.address.mock;
  const mockAbi = cfg.abis.mock;

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const { refetch: refetchCounter } = useReadContract({
    address: mockAddress as `0x${string}`,
    abi: mockAbi,
    functionName: "getCounter",
    args: [account.address as `0x${string}`],
    query: { enabled: false },
  });

  const increment = async () => {
    setIsIncrementing(true);
    setIncrementResult(null);
    setDecryptedCounter(null);

    try {
      writeContract({
        address: mockAddress as `0x${string}`,
        abi: mockAbi,
        functionName: "conditionalIncrement",
      });
    } catch (err) {
      console.error("Error incrementing:", err);
      setIncrementResult({
        success: false,
        message:
          err instanceof Error ? err.message : "Increment transaction failed",
      });
      setIsIncrementing(false);
    }
  };

  useEffect(() => {
    if (isConfirmed && isIncrementing) {
      setIncrementResult({
        success: true,
        message:
          "Increment submitted successfully! Decrypt to see if it counted.",
      });
      setIsIncrementing(false);
    }
  }, [isConfirmed, isIncrementing]);

  useEffect(() => {
    if (writeError && isIncrementing) {
      setIncrementResult({
        success: false,
        message: "Increment transaction failed. Please try again.",
      });
      setIsIncrementing(false);
    }
  }, [writeError, isIncrementing]);

  const decryptCounter = async () => {
    if (!account.address) return;

    setIsDecrypting(true);
    try {
      const result = await refetchCounter();

      if (!result.data) {
        setIncrementResult({
          success: false,
          message: "No counter found. Please increment first.",
        });
        setIsDecrypting(false);
        return;
      }

      const encryptedCounter = result.data as string;
      const decrypted = await userDecrypt([encryptedCounter], mockAddress);

      if (!decrypted || !decrypted[encryptedCounter]) {
        setIncrementResult({
          success: false,
          message: "Failed to decrypt counter",
        });
        setIsDecrypting(false);
        return;
      }

      const counter = String(decrypted[encryptedCounter]);
      setDecryptedCounter(counter);
    } catch (err) {
      console.error("Error decrypting counter:", err);
      setIncrementResult({
        success: false,
        message: err instanceof Error ? err.message : "Decryption failed",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    increment,
    isIncrementing: isIncrementing || isConfirming,
    incrementResult,
    decryptCounter,
    isDecrypting,
    decryptedCounter,
  };
}
