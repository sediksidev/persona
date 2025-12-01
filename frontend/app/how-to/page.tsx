import Layout from "@/components/Layout";

export default function HowToPage() {
    return (
        <Layout currentPage="how-to" maxWidth="4xl">
            <main className="py-12">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-semibold text-gray-900">Integration guide</h1>
                    <p className="text-gray-600">
                        How to integrate Persona into your smart contract
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                1
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Import IPersona interface</h2>
                        </div>
                        <p className="mb-4 text-sm text-gray-600">
                            Import the necessary dependencies in your Solidity contract
                        </p>
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                                <p className="text-xs font-medium text-gray-600">Solidity</p>
                            </div>
                            <pre className="overflow-x-auto p-4">
                                <code className="text-xs text-gray-900">{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IPersona} from "./IPersona.sol";

contract MyDApp is ZamaEthereumConfig {
    IPersona public persona;
    
    constructor(address personaAddr) {
        persona = IPersona(personaAddr);
    }
}`}</code>
                            </pre>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                2
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Register your contract as verifier</h2>
                        </div>
                        <p className="mb-4 text-sm text-gray-600">
                            Contact Persona admin to register your contract address. Only registered verifiers can call verification functions.
                        </p>
                        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Note:</span> Your contract must be registered by the Persona admin before it can access verification functions. Provide your deployed contract address to the admin.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                                3
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Users can start using your dApp</h2>
                        </div>
                        <p className="mb-4 text-sm text-gray-600">
                            Once registered in Persona, users can immediately interact with your dApp. Implement verification logic using FHE operations.
                        </p>
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                                <p className="text-xs font-medium text-gray-600">Solidity</p>
                            </div>
                            <pre className="overflow-x-auto p-4">
                                <code className="text-xs text-gray-900">{`// Example: Age-gated voting
function vote() external {
    address user = msg.sender;
    
    // Get encrypted boolean: is user 19+?
    ebool canVote = persona.isAgeAtLeast(user, 19);
    
    // Conditional state update using FHE.select
    euint8 newVotes = FHE.add(votes[user], FHE.asEuint8(1));
    votes[user] = FHE.select(canVote, newVotes, votes[user]);
    
    // Transaction always succeeds, state only changes if eligible
}

// Example: Multi-condition airdrop
function claimReward() external {
    address user = msg.sender;
    
    // Combine multiple conditions
    ebool isMale = persona.isMale(user);
    ebool isBelow30 = persona.isAgeBetween(user, 0, 29);
    ebool canClaim = FHE.and(isMale, isBelow30);
    
    euint8 newClaims = FHE.add(claimCount[user], FHE.asEuint8(1));
    claimCount[user] = FHE.select(canClaim, newClaims, claimCount[user]);
}`}</code>
                            </pre>
                        </div>
                    </div>

                    {/* Step 4 - Privacy Note */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="text-xl">🔒</span>
                            <h3 className="text-lg font-semibold text-gray-900">Privacy protection</h3>
                        </div>
                        <p className="mb-3 text-sm text-gray-700">
                            Whether a user is eligible or not, the transaction will always execute successfully. The state will only change if the user meets the criteria.
                        </p>
                        <p className="text-sm text-gray-700">
                            This design ensures that transaction success/failure does not leak information about a user&apos;s private attributes (age, gender, etc.), maintaining zero-knowledge privacy guarantees.
                        </p>
                    </div>
                </div>

                {/* Available Functions */}
                <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Available verification functions</h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 text-sm">
                            <code className="shrink-0 rounded bg-gray-100 px-2 py-1 text-xs text-gray-900">
                                isAgeAtLeast(user, age)
                            </code>
                            <span className="text-gray-600">Check if user age ≥ specified age</span>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <code className="shrink-0 rounded bg-gray-100 px-2 py-1 text-xs text-gray-900">
                                isAgeBetween(user, min, max)
                            </code>
                            <span className="text-gray-600">Check if user age is in range [min, max]</span>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <code className="shrink-0 rounded bg-gray-100 px-2 py-1 text-xs text-gray-900">
                                isMale(user)
                            </code>
                            <span className="text-gray-600">Check if user gender is male</span>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <code className="shrink-0 rounded bg-gray-100 px-2 py-1 text-xs text-gray-900">
                                isFemale(user)
                            </code>
                            <span className="text-gray-600">Check if user gender is female</span>
                        </div>
                    </div>
                    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-medium text-gray-700">All functions return ebool (encrypted boolean)</p>
                        <p className="mt-1 text-xs text-gray-600">
                            Use FHE.select(), FHE.and(), FHE.or() to build conditional logic while maintaining encryption
                        </p>
                    </div>
                </div>

                {/* Reference */}
                <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Complete examples</h3>
                    <p className="mb-4 text-sm text-gray-600">
                        See <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-900">PersonaMock.sol</code> for complete implementation examples:
                    </p>
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600">✓</span>
                            <span className="text-gray-700">Age-gated voting (19+)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600">✓</span>
                            <span className="text-gray-700">Gender-gated content access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600">✓</span>
                            <span className="text-gray-700">Multi-condition airdrop</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600">✓</span>
                            <span className="text-gray-700">Conditional state updates</span>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
