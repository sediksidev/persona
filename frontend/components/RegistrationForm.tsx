"use client";
import Link from "next/link";
import { useRegistration } from "@/hooks/useRegistration";
import { useUserData } from "@/hooks/useUserData";
import UserDataModal from "./UserDataModal";

export default function RegistrationForm() {
    const {
        birthday,
        gender,
        isSubmitting,
        success,
        error,
        buttonText,
        handleSubmit,
        handleReset,
        setBirthday,
        setGender,
    } = useRegistration();

    const {
        isModalOpen,
        userData,
        decryptedData,
        isLoading: isLoadingData,
        error: dataError,
        fetchUserData,
        closeModal,
        isDecrypting,
        decryptAllData,
    } = useUserData();


    if (success) {
        return (
            <>
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">Registration complete</h2>
                    <p className="mb-6 text-sm text-gray-600">Encrypted identity stored on-chain. Ready for verification.</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={fetchUserData}
                            disabled={isLoadingData}
                            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoadingData ? "Loading..." : "See My Data"}
                        </button>
                        <Link
                            href="/use-cases"
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            View integration examples
                        </Link>
                        <button
                            onClick={handleReset}
                            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Register another
                        </button>
                    </div>
                    {dataError && (
                        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                            <p className="text-sm text-red-800">{dataError}</p>
                        </div>
                    )}
                </div>
                <UserDataModal

                    isOpen={isModalOpen}
                    onClose={closeModal}
                    userData={userData}
                    decryptedData={decryptedData}
                    isDecrypting={isDecrypting}
                    decryptAllData={decryptAllData}
                />
            </>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Demo: User registration</h1>
                    <button
                        onClick={fetchUserData}
                        disabled={isLoadingData}
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {isLoadingData ? "Loading..." : "See My Data"}
                    </button>
                </div>

                {dataError && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-800">{dataError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="birthday" className="mb-1.5 block text-sm font-medium text-gray-700">
                            Birthday
                        </label>
                        <input
                            type="date"
                            id="birthday"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            min="1970-01-01"
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                            required
                        >
                            <option value="">Select</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Other</option>
                        </select>
                    </div>

                    <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                        <p className="mb-2 text-sm font-medium text-gray-900">What happens:</p>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li>• fhEVM encrypts data before submission</li>
                            <li>• Persona contract stores encrypted euint64/euint8</li>
                            <li>• Your dApp can verify conditions via Persona API</li>
                        </ul>
                        <div className="mt-3 border-t border-blue-300 pt-3">
                            <p className="mb-1.5 text-sm font-medium text-gray-900">Important notes:</p>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>• Cannot detect if data is valid or invalid before submission</li>
                                <li>• All transactions execute regardless of validity (for data privacy)</li>
                                <li>• Click &quot;See My Data&quot; and decrypt to view your stored data</li>
                                <li>• If values show 0x00...000, you haven&apos;t submitted data yet</li>
                            </ul>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || !birthday || !gender}
                        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
            <UserDataModal
                isOpen={isModalOpen}
                onClose={closeModal}
                userData={userData}
                decryptedData={decryptedData}
                isDecrypting={isDecrypting}
                decryptAllData={decryptAllData}
            />
        </>
    );
}
