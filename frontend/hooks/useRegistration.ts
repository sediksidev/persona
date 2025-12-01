import { contractsConfig as cfg } from "@/services/contracts/config";
import { useFhevmContext } from "@/services/fhevm/useFhevmContext";
import { generateUnixTimestamp } from "@/utils/unixTimestamp";
import { useState, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { bytesToHex } from "viem";

export function useRegistration() {
  const [buttonText, setButtonText] = useState("Register");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const account = useAccount();
  const { instance: fhe, status: fheStatus } = useFhevmContext();
  const { writeContractAsync } = useWriteContract();
  const contractAddress = cfg.address.persona;
  const contractAbi = cfg.abis.persona;

  const encrypt = useCallback(
    async (birthdayTimestamp: number, gender: number) => {
      if (!fhe || fheStatus !== "ready") throw new Error("FHEVM not ready");
      const buffer = fhe.createEncryptedInput(
        contractAddress,
        account.address as `0x${string}`
      );
      buffer.add64(birthdayTimestamp);
      buffer.add8(gender);
      const ciphertext = buffer.encrypt();
      return ciphertext;
    },
    [fhe, fheStatus, contractAddress, account.address]
  );

  const register = async (birthday: string, gender: string) => {
    const year = parseInt(birthday.slice(0, 4));
    const month = parseInt(birthday.slice(5, 7));
    const day = parseInt(birthday.slice(8, 10));
    const birthdayTimestamp = generateUnixTimestamp(year, month, day);
    const genderValue = parseInt(gender);

    console.log("Encrypting data...");
    console.log("Birthday timestamp:", birthdayTimestamp);
    console.log("Gender value:", genderValue);

    setButtonText("Encrypting...");
    const ciphertext = await encrypt(birthdayTimestamp, genderValue);

    console.log("Ciphertext structure:", ciphertext);
    console.log("Handles:", ciphertext.handles);
    console.log("Input proof:", ciphertext.inputProof);

    setButtonText("Submitting...");
    const tx = await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractAbi,
      functionName: "store",
      args: [
        bytesToHex(ciphertext.handles[0]),
        bytesToHex(ciphertext.handles[1]),
        bytesToHex(ciphertext.inputProof),
      ],
    });

    console.log("Transaction sent:", tx);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register(birthday, gender);
      setSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
      setButtonText("Register");
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setBirthday("");
    setGender("");
    setError(null);
  };

  const isFormValid = birthday && gender;

  return {
    // State
    birthday,
    gender,
    isSubmitting,
    success,
    error,
    buttonText,
    isFormValid,

    // Actions
    setBirthday,
    setGender,
    handleSubmit,
    handleReset,
  };
}
