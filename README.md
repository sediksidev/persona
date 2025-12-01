# **Persona – Privacy-Preserving Identity Protocol**

**Zero-knowledge identity verification powered by Fully Homomorphic Encryption (FHE)**

Persona is a privacy-first identity layer that enables on-chain verification of personal attributes (such as age and gender) **without revealing the underlying data**.
Built on **Zama’s fhEVM**, Persona provides a foundation for privacy-preserving KYC, age-gated content, targeted airdrops, governance filters, and more.

---

## 🌐 Network

**Sepolia Testnet (Zama fhEVM compatible)**
All contracts are deployed on the Sepolia testnet. Make sure your wallet is configured for it.

---

## ❓ What is Persona?

Persona lets users store encrypted personal data (birthday, gender) on-chain and allows dApps or smart contracts to verify conditions **without decrypting** anything.

### Example Use Cases

* 🗳️ **DAO Voting**: Allow voting only for users over 18 without collecting dates of birth
* 🎯 **Targeted Airdrops**: Reward specific demographics (for example: males under 30)
* 🔞 **Age-Gated Content**: Control access to adult content
* 👥 **Gender-Based Communities**: Access control for women-only spaces
* 💼 **Compliant DeFi**: Privacy-preserving KYC checks

---

## ⚡ Key Concept: Persona Returns `ebool`, Not `bool`

All verification functions (`isAgeAtLeast`, `isFemale`, etc.) return **encrypted booleans** (`ebool`), not plaintext booleans.

### This means:

* ✅ **No transaction reverts** when verification fails
* ✅ **Privacy-preserving** results
* ✅ **Conditional updates via `FHE.select()`**
* ✅ **Smooth UX** even for ineligible users

### Example

```solidity
// User calls claimReward() but is 16
ebool isAdult = persona.isAgeAtLeast(msg.sender, 18);

// No revert occurs
euint8 reward = FHE.select(
    isAdult,
    FHE.asEuint8(100),   // Adult reward
    FHE.asEuint8(0)      // Minor reward
);

// Transaction succeeds, data stays encrypted
```

---

## 🏛️ Architecture

```
┌──────────────────────────────────────────────┐
│ User (Frontend)                              │
│ - Encrypt birthday & gender                  │
│ - Submit encrypted data                      │
│ - Decrypt their own data                     │
└───────────────────┬──────────────────────────┘
                    ▼
┌──────────────────────────────────────────────┐
│ Persona Contract                             │
│ - Stores euint64 (birthday) & euint8 (gender)│
│ - Validates encrypted inputs                 │
│ - Authorizes verifier contracts              │
│ - Returns ebool for all checks               │
└───────────────────┬──────────────────────────┘
                    ▼
┌──────────────────────────────────────────────┐
│ Verifier Contracts                           │
│ - Call `isAgeAtLeast`, `isFemale`, etc.      │
│ - Use `FHE.select()` for conditional logic   │
│ - No revert on failed verification           │
└──────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
persona/
├── contract/
│   ├── contracts/
│   │   ├── Persona.sol
│   │   ├── PersonaMock.sol
│   │   └── IPersona.sol
│   ├── test/
│   └── deploy/
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── use-cases/
    │   └── how-to/
    ├── components/
    ├── hooks/
    └── services/
```

---

## 🚀 Quick Start

### 1. Smart Contracts

```bash
cd contract
npm install
npm run compile
npm run test

# Deploy to Sepolia fhEVM
npx hardhat deploy --network zama
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

`.env.local`

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ALCHEMY_ID=
```

---

## ⭐ Key Features

### Privacy-First

* Client-side encryption
* No plaintext identity data stored on-chain
* Zero-knowledge-style verification via FHE
* Selective disclosure by the user

### Developer-Friendly

* Simple API: `persona.isAgeAtLeast(user, 18)`
* All results encrypted (`ebool`)
* Verifier-contract authorization
* No `require()` or revert on eligibility checks

### Production-Ready

* Immutable identity data
* Encrypted validation logic
* Access control for verifier contracts
* Resistant to front-running & data scraping

---

## 📜 Deployed Contracts (Sepolia)

| Contract    | Address                                      | Description         |
| ----------- | -------------------------------------------- | ------------------- |
| Persona     | `0xc0cF5CC4348bE7D1E447B4EC5B5ee440A2C81Eb7` | Core identity layer |
| PersonaMock | `0x9B38E8348BCaFf9BbFA182fDBA005d15c6f0fD2B` | Integration demo    |

---

## 🧬 Live Example Patterns (PersonaMock)

### 1. Conditional Counter (`conditionalIncrement`)

* Condition: Age ≥ 18
* Adults increment counter
* Minors: transaction succeeds, no effect

### 2. Age-Gated Voting (`vote`)

* Count vote only for adults
* Underage users can still call without breaking UX

### 3. Gender-Gated Content (`viewContent`)

* Female-only access
* Non-female: no state update

### 4. Targeted Airdrop (`claimReward`)

* Condition: Male AND Age < 30
* Eligible users receive tokens
* Ineligible users get 0, no revert

---

## 🔗 Integration Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPersona} from "./IPersona.sol";
import {FHE, ebool, euint8} from "@fhevm/solidity/lib/FHE.sol";

contract MyContract {
    IPersona public persona;
    mapping(address => euint8) private _rewards;

    constructor(address personaAddr) {
        persona = IPersona(personaAddr);
    }

    function claimReward() external {
        ebool isAdult = persona.isAgeAtLeast(msg.sender, 18);

        euint8 reward = FHE.select(
            isAdult,
            FHE.asEuint8(100),
            FHE.asEuint8(0)
        );

        _rewards[msg.sender] = FHE.add(_rewards[msg.sender], reward);
    }
}
```

---

## 🔍 How It Works

### Registration Flow

1. User inputs birthday + gender
2. Frontend encrypts data locally
3. Sends encrypted data to Persona contract
4. Contract stores and validates them (all encrypted)

### Verification Flow

1. Verifier calls a function (e.g. `isAgeAtLeast`)
2. Persona performs encrypted calculation
3. Returns `ebool`
4. Verifier uses `FHE.select()` for conditional logic

### Decryption Flow

* Only the user can decrypt their own data
* Decryption requires the user’s wallet signature
* Contract never sees plaintext

---

## 📚 Documentation

* Contract README
* Frontend README
* Zama fhEVM Docs
* API Reference (coming soon)

---

## 🧪 Testing

### Contract

```bash
cd contract
npm run test
npm run coverage
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

---

## 🧭 Use Cases

* Governance (age verification)
* DeFi compliance
* Gaming content gates
* Education eligibility checks
* Healthcare age-based access
* Event ticketing
* Dating apps demographic filters

---

## 🔐 Security Considerations

* Immutable identity
* Encrypted input validation
* Verifier-only access
* No plaintext storage
* Graceful failures (no revert)
* Client-side encryption keys

---

## 📜 License

MIT License

---

## 🤝 Support & Community

* 📘 Docs: [https://docs.zama.ai](https://docs.zama.ai)
* 💬 Discord: Zama Community
* 🐞 GitHub Issues
* 🐦 Twitter: @zama_fhe

---

❤️ Privacy is a right, not a privilege.
