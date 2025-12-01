import { contractsConfig as cfg } from "@/services/contracts/config";
import { useFheDecryption } from "@/services/fhevm/useFhevmContext";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export function useVote() {
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [decryptedCount, setDecryptedCount] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const account = useAccount();
  const { userDecrypt } = useFheDecryption();
  const mockAddress = cfg.address.mock;
  const mockAbi = cfg.abis.mock;

  // Write contract for voting
  const { writeContract, data: hash, error: writeError } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Read vote count
  const { refetch: refetchVoteCount } = useReadContract({
    address: mockAddress as `0x${string}`,
    abi: mockAbi,
    functionName: "getVoteCount",
    args: [account.address as `0x${string}`],
    query: {
      enabled: false,
    },
  });

  const vote = async () => {
    setIsVoting(true);
    setVoteResult(null);
    setDecryptedCount(null);

    try {
      writeContract({
        address: mockAddress as `0x${string}`,
        abi: mockAbi,
        functionName: "vote",
      });

      // Wait for transaction to be confirmed
      // Note: useWaitForTransactionReceipt will handle this automatically
    } catch (err) {
      console.error("Error voting:", err);
      setVoteResult({
        success: false,
        message: err instanceof Error ? err.message : "Vote transaction failed",
      });
      setIsVoting(false);
    }
  };

  // Update result when transaction is confirmed
  if (isConfirmed && isVoting) {
    setVoteResult({
      success: true,
      message: "Vote submitted successfully! Decrypt to see if it counted.",
    });
    setIsVoting(false);
  }

  // Update result when transaction fails
  if (writeError && isVoting) {
    setVoteResult({
      success: false,
      message: "Vote transaction failed. Please try again.",
    });
    setIsVoting(false);
  }

  const decryptVoteCount = async () => {
    if (!account.address) return;

    setIsDecrypting(true);
    try {
      // Fetch current vote count
      const result = await refetchVoteCount();

      if (!result.data) {
        setVoteResult({
          success: false,
          message: "No vote count found. Please vote first.",
        });
        setIsDecrypting(false);
        return;
      }

      const encryptedCount = result.data as string;
      console.log("Encrypted vote count:", encryptedCount);

      // Decrypt the count
      const decrypted = await userDecrypt([encryptedCount], mockAddress);

      if (!decrypted || !decrypted[encryptedCount]) {
        setVoteResult({
          success: false,
          message: "Failed to decrypt vote count",
        });
        setIsDecrypting(false);
        return;
      }

      const count = String(decrypted[encryptedCount]);
      setDecryptedCount(count);

      console.log("Decrypted vote count:", count);
    } catch (err) {
      console.error("Error decrypting vote count:", err);
      setVoteResult({
        success: false,
        message: err instanceof Error ? err.message : "Decryption failed",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    vote,
    isVoting: isVoting || isConfirming,
    voteResult,
    decryptVoteCount,
    isDecrypting,
    decryptedCount,
  };
}
