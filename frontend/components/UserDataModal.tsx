"use client";

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

interface UserDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserData | null;
    decryptedData: DecryptedData;
    isDecrypting: boolean;
    decryptAllData: () => Promise<void>;
}

export default function UserDataModal({
    isOpen,
    onClose,
    userData,
    decryptedData,
    isDecrypting,
    decryptAllData,
}: UserDataModalProps) {
    // Format decrypted data for display
    const formatBirthday = (timestamp: string | null) => {
        if (!timestamp) return null;
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatGender = (value: string | null) => {
        if (value === null) return null;
        if (value === "1") return "Male";
        if (value === "2") return "Female";
        if (value === "3") return "Other";
        return "Unknown";
    };

    const formatIsValid = (value: string | null) => {
        if (value === null) return null;
        return value === "true" ? "✓ Valid" : "✗ Invalid";
    };





    if (!isOpen) return null;







    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20" onClick={onClose}>
            <div className="relative w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="mb-6 text-2xl font-semibold text-gray-900">My Encrypted Data</h2>

                {userData?.birthday === "0x0000000000000000000000000000000000000000000000000000000000000000" &&
                    userData?.gender === "0x0000000000000000000000000000000000000000000000000000000000000000" &&
                    userData?.isValid === "0x0000000000000000000000000000000000000000000000000000000000000000" ? (
                    <div className="rounded-md border border-yellow-200 bg-yellow-50 p-6">
                        <div className="flex items-center gap-3">
                            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <p className="text-lg font-semibold text-yellow-900">No Data Found</p>
                                <p className="text-sm text-yellow-800">You haven&apos;t registered yet. Please register first to store your encrypted data on-chain.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Birthday (euint64)
                            </label>
                            <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
                                <code className="break-all text-sm text-gray-800">
                                    {userData?.birthday || "N/A"}
                                </code>
                                {decryptedData.birthday && (
                                    <div className="mt-3 flex items-center gap-2 rounded-md border-l-4 border-green-500 bg-green-50 p-3">
                                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-semibold text-green-900">
                                            {formatBirthday(decryptedData.birthday)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Gender (euint8)
                            </label>
                            <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
                                <code className="break-all text-sm text-gray-800">
                                    {userData?.gender || "N/A"}
                                </code>
                                {decryptedData.gender && (
                                    <div className="mt-3 flex items-center gap-2 rounded-md border-l-4 border-green-500 bg-green-50 p-3">
                                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-semibold text-green-900">
                                            {formatGender(decryptedData.gender)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Is Valid (ebool)
                            </label>
                            <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
                                <code className="break-all text-sm text-gray-800">
                                    {userData?.isValid || "N/A"}
                                </code>
                                {decryptedData.isValid !== null && (
                                    <div className="mt-3 flex items-center gap-2 rounded-md border-l-4 border-green-500 bg-green-50 p-3">
                                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-semibold text-green-900">
                                            {formatIsValid(decryptedData.isValid)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 rounded-md border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                        🔒 These values are encrypted on-chain. Click &quot;Decrypt All&quot; below to reveal the actual values using your private key.
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={decryptAllData}
                        disabled={isDecrypting}
                        type="button"
                        className="flex-1 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            <div>{isDecrypting ? "Decrypting..." : "Decrypt All"}</div>
                        </div>
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
