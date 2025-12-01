"use client";

import { useState } from "react";
import Layout from "@/components/Layout";

type Tab = "vote" | "view" | "claim" | "increment";

export default function UseCasesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("vote");
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const executeAction = async () => {
    setIsExecuting(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = Math.random() > 0.3;
    setResult({
      success,
      message: success ? "Action successful!" : "Action failed. Persona criteria not met.",
    });
    setIsExecuting(false);
  };

  const tabs = [
    { id: "vote" as Tab, label: "Voting", icon: "🗳️" },
    { id: "view" as Tab, label: "Content", icon: "👁️" },
    { id: "claim" as Tab, label: "Airdrop", icon: "🎁" },
    { id: "increment" as Tab, label: "Counter", icon: "📊" },
  ];

  const content = {
    vote: {
      title: "Age-Gated Voting",
      requirement: "Age > 18",
      description: "Restrict voting to adults without collecting birthdates. Perfect for DAOs.",
      code: "persona.isAgeAtLeast(user, 19)",
    },
    view: {
      title: "Gender-Gated Access",
      requirement: "Gender = Female",
      description: "Control content access by gender without storing gender data.",
      code: "persona.isFemale(user)",
    },
    claim: {
      title: "Multi-Condition Airdrop",
      requirement: "Male AND Age < 30",
      description: "Complex eligibility criteria using AND/OR logic on encrypted attributes.",
      code: "FHE.and(persona.isMale(user), persona.isAgeBetween(user, 0, 29))",
    },
    increment: {
      title: "Conditional Counter",
      requirement: "Age ≥ 18",
      description: "Increment state only if conditions are met. Useful for engagement tracking.",
      code: "FHE.select(persona.isAgeAtLeast(user, 18), newValue, oldValue)",
    },
  };

  return (
    <Layout currentPage="use-cases" maxWidth="4xl">
      <main className="py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">Integration examples</h1>
          <p className="text-gray-600">See how developers can use Persona in their contracts</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResult(null);
              }}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">{content[activeTab].title}</h2>

          <div className="mb-6 space-y-3">
            <div className="rounded-md bg-blue-50 p-3">
              <p className="mb-1 text-xs font-medium text-gray-700">Requirement</p>
              <p className="text-sm text-gray-900">{content[activeTab].requirement}</p>
            </div>

            <div className="rounded-md bg-gray-50 p-3">
              <p className="mb-1 text-xs font-medium text-gray-700">Description</p>
              <p className="text-sm text-gray-900">{content[activeTab].description}</p>
            </div>

            <div className="rounded-md bg-gray-900 p-3">
              <p className="mb-1 text-xs font-medium text-gray-400">Function call</p>
              <code className="text-sm text-green-400">{content[activeTab].code}</code>
            </div>
          </div>

          <button
            onClick={executeAction}
            disabled={isExecuting}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExecuting ? "Executing..." : "Execute action"}
          </button>

          {/* Result */}
          {result && (
            <div
              className={`mt-4 rounded-md p-4 ${result.success
                ? "bg-green-50 text-green-900"
                : "bg-red-50 text-red-900"
                }`}
            >
              <p className="mb-1 text-sm font-medium">{result.success ? "✓ Success" : "✗ Failed"}</p>
              <p className="text-sm opacity-90">{result.message}</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Integration guide</h3>
          <div className="space-y-1.5 text-sm text-gray-600">
            <p>• Import IPersona interface in your Solidity contract</p>
            <p>• Set your contract as verifier via Persona.setVerifier()</p>
            <p>• Call verification functions (returns encrypted ebool)</p>
            <p>• Use FHE.select() for conditional logic on results</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
