"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import RestrictedPage from "@/components/RestrictedPage";
import { examples, type Tab } from "./examples";
import VoteExample from "./VoteExample";
import ViewExample from "./ViewExample";
import ClaimExample from "./ClaimExample";
import IncrementExample from "./IncrementExample";
import { typography, spacing, buttons, cards, borders } from "@/styles/design-system";

export default function UseCasesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("vote");

  const renderExample = () => {
    switch (activeTab) {
      case "vote":
        return <VoteExample />;
      case "view":
        return <ViewExample />;
      case "claim":
        return <ClaimExample />;
      case "increment":
        return <IncrementExample />;
      default:
        return <VoteExample />;
    }
  };

  return (
    <Layout currentPage="use-cases" maxWidth="4xl">
      <RestrictedPage>
        <main className={spacing.py.xl}>
          <div className={spacing.mb.xl}>
            <h1 className={`${typography.h1} ${spacing.mb.sm}`}>Integration examples</h1>
            <p className={typography.body}>See how developers can use Persona in their contracts</p>
          </div>

          {/* Tabs */}
          <div className={`${spacing.mb.lg} flex ${spacing.gap.xs} ${borders.width.bottom}`}>
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => {
                  setActiveTab(example.id);
                }}
                className={activeTab === example.id ? buttons.tabActive : buttons.tab}
              >
                <span>{example.icon}</span>
                <span>{example.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {renderExample()}

          {/* Info Box */}
          <div className={`${cards.base} ${spacing.mt.lg}`}>
            <h3 className={`${typography.bodyBold} ${spacing.mb.sm}`}>Integration guide</h3>
            <div className={`${spacing.spaceY.xs} ${typography.body}`}>
              <p>• Import IPersona interface in your Solidity contract</p>
              <p>• Set your contract as verifier via Persona.setVerifier()</p>
              <p>• Call verification functions (returns encrypted ebool)</p>
              <p>• Use FHE.select() for conditional logic on results</p>
            </div>
          </div>
        </main>
      </RestrictedPage>
    </Layout>
  );
}
