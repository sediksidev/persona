"use client";

import Link from "next/link";
import { useState } from "react";
import Layout from "@/components/Layout";
import RestrictedPage from "@/components/RestrictedPage";

export default function RegisterPage() {
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSuccess(true);
  };

  return (
    <Layout currentPage="register" maxWidth="4xl">
      <RestrictedPage>
        <main className="py-12">
          {!success ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <h1 className="mb-6 text-2xl font-semibold text-gray-900">Demo: User registration</h1>

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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !birthday || !gender}
                  className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">Registration complete</h2>
              <p className="mb-6 text-sm text-gray-600">Encrypted identity stored on-chain. Ready for verification.</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/use-cases"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  View integration examples
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setBirthday("");
                    setGender("");
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Register another
                </button>
              </div>
            </div>
          )}
        </main>
      </RestrictedPage>
    </Layout>
  );
}
