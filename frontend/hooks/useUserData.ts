import { contractsConfig as cfg } from "@/services/contracts/config";
import { useFheDecryption } from "@/services/fhevm/useFhevmContext";
import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";

interface UserData {
  birthday: string;
  gender: string;
  isValid: string;
}

interface DecryptedData {
  birthday: string | null;
  gender: string | null;
  isValid: string | null;
}

export function useUserData() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [decryptedData, setDecryptedData] = useState<DecryptedData>({
    birthday: null,
    gender: null,
    isValid: null,
  });
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useAccount();
  const { userDecrypt } = useFheDecryption();
  const contractAddress = cfg.address.persona;
  const contractAbi = cfg.abis.persona;

  const { refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractAbi,
    functionName: "getUserData",
    args: [account.address as `0x${string}`],
    query: {
      enabled: false, // Don't auto-fetch
    },
  });

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await refetch();

      if (result.data) {
        console.log("Raw result from contract:", result.data);

        const [birthday, gender, isValid] = result.data as [
          string,
          string,
          string
        ];

        console.log("Handles from contract:", { birthday, gender, isValid });

        // Data already in correct hex format from contract
        setUserData({
          birthday: birthday,
          gender: gender,
          isValid: isValid,
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const decryptAllData = async () => {
    if (!userData) return;
    console.log("Starting decryption for all data...");
    setIsDecrypting(true);

    try {
      const decrypted = await userDecrypt(
        [userData.birthday, userData.gender, userData.isValid],
        contractAddress
      );

      if (!decrypted) {
        console.error("Decryption failed: No data returned");
        setError("Decryption failed");
        return;
      }

      console.log("Decrypted data:", decrypted);

      // Convert decrypted values (object with handle as key)
      const birthdayValue = decrypted[userData.birthday];
      const genderValue = decrypted[userData.gender];
      const isValidValue = decrypted[userData.isValid];

      setDecryptedData({
        birthday: birthdayValue !== undefined ? String(birthdayValue) : null,
        gender: genderValue !== undefined ? String(genderValue) : null,
        isValid: isValidValue !== undefined ? String(isValidValue) : null,
      });
    } catch (err) {
      console.error("Error during decryption:", err);
      setError(err instanceof Error ? err.message : "Decryption failed");
    } finally {
      setIsDecrypting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDecryptedData({ birthday: null, gender: null, isValid: null });
  };

  return {
    isModalOpen,
    userData,
    decryptedData,
    isDecrypting,
    isLoading,
    error,
    fetchUserData,
    closeModal,
    decryptAllData,
  };
}
