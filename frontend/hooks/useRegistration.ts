import { contractsConfig as cfg } from "@/services/contracts/config";
import { useState } from "react";
import { useWriteContract } from "wagmi";

export function useRegistration() {
  const [buttonText, setButtonText] = useState("Register");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { writeContract } = useWriteContract();
  const contractAddress = cfg.address.persona;
  const contractAbi = cfg.abis.persona;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setButtonText("Submitting...");
    setError(null);

    try {
      // TODO: Step 1 - Get fhEVM instance
      // const fhevmInstance = await getFhevmInstance();

      // TODO: Step 2 - Encrypt birthday (euint64)
      // Convert birthday to timestamp or age
      // const birthdayTimestamp = new Date(birthday).getTime();
      // const encryptedBirthday = await fhevmInstance.encrypt64(birthdayTimestamp);

      // TODO: Step 3 - Encrypt gender (euint8)
      // const genderValue = parseInt(gender);
      // const encryptedGender = await fhevmInstance.encrypt8(genderValue);

      // TODO: Step 4 - Call Persona contract
      // const personaContract = getPersonaContract();
      // const tx = await personaContract.register(encryptedBirthday, encryptedGender);
      // await tx.wait();

      // Temporary simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
