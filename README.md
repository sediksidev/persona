# Persona - Privacy-Preserving Identity Protocol

> Zero-knowledge identity verification powered by Fully Homomorphic Encryption (FHE)

Persona is a privacy-first identity layer that enables on-chain verification of personal attributes (age, gender) without revealing the actual data. Built on Zama's fhEVM, it provides a foundation for privacy-preserving KYC, age-gated content, targeted airdrops, and more.

## 🎯 What is Persona?

Persona allows users to **store encrypted personal data** (birthday, gender) on the blockchain and enables smart contracts to **verify conditions** without ever decrypting the data.

**Example Use Cases:**
- 🗳️ **DAO Voting**: Restrict voting to users over 18 without collecting birthdates
- 🎁 **Targeted Airdrops**: Distribute tokens to specific demographics (e.g., males under 30)
- 🔞 **Age-Gated Content**: Control access to adult content without revealing age
- 👥 **Gender-Specific Communities**: Exclusive access based on gender
- 🏦 **Compliant DeFi**: Privacy-preserving KYC/AML checks

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User (Frontend)                       │
│  - Encrypt birthday & gender client-side                 │
│  - Submit encrypted data to Persona contract             │
│  - Decrypt own data when needed                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Persona Protocol (Contract)                 │
│  - Store encrypted euint64 (birthday timestamp)          │
│  - Store encrypted euint8 (gender: 1=M, 2=F, 3=Other)    │
│  - Validate data integrity (encrypted checks)            │
│  - Provide verification functions to authorized contracts│
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│          Verifier Contracts (PersonaMock, etc.)          │
│  - Call persona.isAgeAtLeast(user, 18)                   │
│  - Call persona.isFemale(user)                           │
│  - Use FHE.select() for conditional logic                │
│  - Everything stays encrypted end-to-end                 │
└─────────────────────────────────────────────────────────┘
```

## 📦 Repository Structure

```
persona/
├── contract/              # Smart contracts (Hardhat)
│   ├── contracts/
│   │   ├── Persona.sol           # Core protocol contract
│   │   ├── PersonaMock.sol       # Integration examples
│   │   └── IPersona.sol          # Interface
│   ├── test/              # Contract tests
│   └── deploy/            # Deployment scripts
│
└── frontend/              # Web interface (Next.js)
    ├── app/               # Next.js pages
    │   ├── page.tsx              # Registration
    │   ├── use-cases/            # Live examples
    │   └── how-to/               # Developer guide
    ├── components/        # UI components
    ├── hooks/             # React hooks for contract interaction
    └── services/          # FHE utilities & contract configs
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **MetaMask** or compatible Web3 wallet
- **Testnet ETH** (Zama testnet)

### 1. Smart Contracts

```bash
cd contract
npm install
npm run compile
npm run test

# Deploy to Zama testnet
npx hardhat deploy --network zama
```

📖 **[Full Contract Documentation](./contract/README.md)**

### 2. Frontend Application

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

📖 **[Full Frontend Documentation](./frontend/README.md)**

## 🔑 Key Features

### Privacy-First Architecture
- ✅ **Client-Side Encryption**: Data encrypted before blockchain submission
- ✅ **Zero-Knowledge Verification**: Contracts verify conditions without decryption
- ✅ **Selective Disclosure**: Users decrypt only when they choose

### Developer-Friendly
- ✅ **Simple Interface**: `persona.isAgeAtLeast(user, 18)` returns encrypted boolean
- ✅ **Composable**: Any contract can be authorized as a verifier
- ✅ **Well-Documented**: Complete examples and integration guides

### Production-Ready
- ✅ **Immutable Data**: One-time storage prevents tampering
- ✅ **Built-in Validation**: Encrypted checks ensure data integrity
- ✅ **Access Control**: Only authorized verifiers can query data

## 📋 Deployed Contracts (Zama Testnet)

| Contract | Address | Description |
|----------|---------|-------------|
| **Persona** | `0xc0cF5CC4348bE7D1E447B4EC5B5ee440A2C81Eb7` | Core protocol |
| **PersonaMock** | `0x9B38E8348BCaFf9BbFA182fDBA005d15c6f0fD2B` | Example integrations |

## 🧪 Live Examples

The PersonaMock contract demonstrates 4 real-world patterns:

### 1. **Conditional Counter** (`conditionalIncrement`)
- **Condition**: Age ≥ 18
- **Use Case**: Track adult-only engagement

### 2. **Age-Gated Voting** (`vote`)
- **Condition**: Age > 18
- **Use Case**: DAO governance

### 3. **Gender-Gated Access** (`viewContent`)
- **Condition**: Gender = Female
- **Use Case**: Exclusive communities

### 4. **Multi-Condition Airdrop** (`claimReward`)
- **Condition**: Male AND Age < 30
- **Use Case**: Targeted token distribution

Try them live at the frontend's **Use Cases** page!

## 💡 Integration Example

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
        // Get encrypted boolean: is user adult?
        ebool isAdult = persona.isAgeAtLeast(msg.sender, 18);
        
        // Conditional logic using FHE
        euint8 reward = FHE.select(
            isAdult,
            FHE.asEuint8(100),  // Adults get 100 tokens
            FHE.asEuint8(0)     // Minors get 0
        );
        
        _rewards[msg.sender] = FHE.add(_rewards[msg.sender], reward);
        
        // Data stays encrypted end-to-end!
    }
}
```

## 🔐 How It Works

### Registration Flow
1. User enters birthday + gender in frontend
2. Frontend encrypts data using FHE (client-side)
3. Encrypted handles sent to Persona contract
4. Contract validates and stores (all encrypted)

### Verification Flow
1. Verifier contract calls `persona.isAgeAtLeast(user, 18)`
2. Persona computes age from encrypted birthday
3. Returns encrypted boolean (ebool)
4. Verifier uses `FHE.select()` for conditional logic
5. **Original data never decrypted!**

### Decryption Flow
1. User clicks "Decrypt" in frontend
2. Signs decryption request with wallet
3. Frontend fetches encrypted handles from contract
4. Relayer decrypts using user's signature
5. Decrypted values shown only to user

## 📚 Documentation

- **[Contract README](./contract/README.md)** - Smart contract development
- **[Frontend README](./frontend/README.md)** - Web application guide
- **[Zama fhEVM Docs](https://docs.zama.ai/fhevm)** - Core FHE technology
- **[API Reference](./docs/API.md)** - Contract interface details *(coming soon)*

## 🛠️ Tech Stack

**Smart Contracts:**
- Solidity 0.8.24
- Zama fhEVM (FHE operations)
- Hardhat (development framework)

**Frontend:**
- Next.js 16 (React framework)
- Wagmi 2.x (Web3 hooks)
- Tailwind CSS 4 (styling)
- TypeScript (type safety)

## 🧪 Testing

**Contract Tests:**
```bash
cd contract
npm run test
npm run coverage
```

**Frontend:**
```bash
cd frontend
npm run lint
npm run build
```

## 🤝 Use Cases & Applications

- **🏛️ Governance**: Age-restricted voting in DAOs
- **💰 Finance**: Compliant DeFi products (accredited investors)
- **🎮 Gaming**: Age-appropriate content filtering
- **🎓 Education**: Verify student status privately
- **🏥 Healthcare**: Age verification for medical services
- **🎭 Events**: Age-gated ticketing systems
- **💍 Dating**: Gender/age filtering in social apps

## 🔒 Security Considerations

1. **Immutability**: Users can only register once
2. **Encrypted Validation**: Birthday < now, Gender ∈ {1,2,3}
3. **Access Control**: Only authorized verifiers can query
4. **Client-Side Encryption**: Keys never leave user's browser
5. **No Data Exposure**: Contract only stores encrypted handles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

- **📖 Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **💬 Discord**: [Zama Community](https://discord.gg/zama)
- **🐛 Issues**: [GitHub Issues](https://github.com/zama-ai/fhevm/issues)
- **🐦 Twitter**: [@zama_fhe](https://twitter.com/zama_fhe)

## 🙏 Acknowledgments

Built with [Zama's fhEVM](https://www.zama.ai/fhevm) - the first confidential smart contract protocol using Fully Homomorphic Encryption.

---

**🔐 Privacy is a right, not a privilege.**

*Built with ❤️ for a more private Web3*
