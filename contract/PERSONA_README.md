# Persona - Encrypted Identity Verification Protocol

A privacy-preserving identity layer built with Fully Homomorphic Encryption (FHE) on Zama's fhEVM. Persona enables on-chain verification of personal attributes (age, gender) without revealing the actual data.

## 🎯 Overview

**Persona** is a protocol layer that allows users to store encrypted personal information (birthday, gender) on-chain and enables smart contracts to verify conditions against this data without ever decrypting it. This creates a foundation for privacy-preserving KYC, age-gated content, gender-specific airdrops, and more.

### Deployed Contracts (Zama Testnet)

- **Persona**: `0xc0cF5CC4348bE7D1E447B4EC5B5ee440A2C81Eb7`
- **PersonaMock**: `0x9B38E8348BCaFf9BbFA182fDBA005d15c6f0fD2B`

## 🔑 Key Features

- **Privacy-First**: Personal data is encrypted client-side before submission
- **Zero-Knowledge Verification**: Smart contracts can verify age/gender conditions without seeing actual values
- **Composable**: Any contract can become a "verifier" to query user attributes
- **Validation**: Built-in encrypted validation ensures data integrity (birthdate < now, gender ∈ [1,2,3])
- **One-Time Storage**: Users can only set their data once (immutable after validation)

## 🏗️ Architecture

### Core Contract: `Persona.sol`

The main protocol contract that stores and verifies encrypted identity data.

**Storage:**
```solidity
mapping(address => euint64) private _birthdays;   // Encrypted Unix timestamp
mapping(address => euint8)  private _genders;      // Encrypted gender (1=Male, 2=Female, 3=Other)
mapping(address => ebool)   private _validations;  // Encrypted validation flag
```

**Key Functions:**

| Function | Description | Access |
|----------|-------------|--------|
| `store()` | Store encrypted birthday & gender | Public (user) |
| `getUserData()` | Retrieve encrypted user data | Public (view) |
| `isAgeAtLeast()` | Check if age ≥ X years | Verifier only |
| `isAgeBetween()` | Check if age ∈ [min, max] | Verifier only |
| `isMale()` / `isFemale()` | Check gender | Verifier only |
| `setVerifier()` | Authorize verifier contract | Owner only |

### Example Contract: `PersonaMock.sol`

Demonstrates 4 real-world integration patterns:

1. **Conditional Increment** (`conditionalIncrement`)
   - Requirement: Age ≥ 18
   - Use Case: Track adult-only engagement metrics

2. **Age-Gated Voting** (`vote`)
   - Requirement: Age > 18 (≥ 19)
   - Use Case: DAO voting restricted to adults

3. **Gender-Gated Access** (`viewContent`)
   - Requirement: Gender = Female
   - Use Case: Gender-specific content access

4. **Multi-Condition Airdrop** (`claimReward`)
   - Requirement: Male AND Age < 30
   - Use Case: Complex eligibility criteria using FHE logic

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   npx hardhat vars set ETHERSCAN_API_KEY  # Optional
   ```

3. **Compile contracts**

   ```bash
   npm run compile
   ```

4. **Run tests**

   ```bash
   npm run test
   ```

### Deployment

**Local Network:**
```bash
# Start FHEVM-compatible local node
npx hardhat node

# Deploy contracts
npx hardhat deploy --network localhost
```

**Testnet (Zama):**
```bash
npx hardhat deploy --network zama

# Verify on explorer (if supported)
npx hardhat verify --network zama <CONTRACT_ADDRESS>
```

## 📋 Integration Guide

### Step 1: Import Interface

```solidity
import {IPersona} from "./IPersona.sol";
import {FHE, ebool} from "@fhevm/solidity/lib/FHE.sol";
```

### Step 2: Set Verifier Access

The contract owner must authorize your contract:

```solidity
// As Persona owner
persona.setVerifier(address(yourContract), true);
```

### Step 3: Use Verification Functions

```solidity
contract YourContract {
    IPersona public persona;
    
    constructor(address personaAddr) {
        persona = IPersona(personaAddr);
    }
    
    function restrictedAction() external {
        // Get encrypted boolean result
        ebool isAdult = persona.isAgeAtLeast(msg.sender, 18);
        
        // Use FHE.select for conditional logic
        euint8 newValue = FHE.add(counter, FHE.asEuint8(1));
        euint8 result = FHE.select(isAdult, newValue, counter);
        
        // Store encrypted result
        counter = result;
    }
}
```

### Example Patterns

**Pattern 1: Age Gate**
```solidity
ebool canAccess = persona.isAgeAtLeast(user, 21);
euint8 result = FHE.select(canAccess, allowedValue, deniedValue);
```

**Pattern 2: Gender Check**
```solidity
ebool isFemale = persona.isFemale(user);
counter = FHE.select(isFemale, incrementedCounter, counter);
```

**Pattern 3: Complex Conditions**
```solidity
ebool isMale = persona.isMale(user);
ebool isYoung = persona.isAgeBetween(user, 18, 30);
ebool eligible = FHE.and(isMale, isYoung);
```

## 📁 Project Structure

```
contract/
├── contracts/
│   ├── Persona.sol          # Main protocol contract
│   ├── PersonaMock.sol       # Integration examples
│   └── IPersona.sol          # Interface for verifiers
├── deploy/
│   └── deploy.ts             # Deployment script
├── test/
│   ├── Persona_UserManagement.ts  # Core functionality tests
│   └── PersonaMock.ts             # Integration tests
├── hardhat.config.ts
└── package.json
```

## 🔐 Security Considerations

1. **Immutability**: Users can only store data once. After validation passes, data cannot be updated.
2. **Validation**: Contract enforces:
   - Birthday < current timestamp
   - Gender ∈ {1, 2, 3}
3. **Access Control**: Only authorized "verifier" contracts can call verification functions
4. **FHE Guarantees**: All computations are done on encrypted data - raw values never leave the client

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test
npx hardhat test test/Persona_UserManagement.ts

# Test with coverage
npm run coverage
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile all contracts |
| `npm run test` | Run all tests |
| `npm run coverage` | Generate coverage report |
| `npm run clean` | Clean build artifacts |

## 📚 Documentation & Resources

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [Zama Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)
- [FHE Solidity Library](https://docs.zama.ai/protocol/solidity-guides/reference/fhe-operations)
- [Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)

## 🤝 Use Cases

- **Age Verification**: Adult content, alcohol sales, voting systems
- **Gender-Specific Services**: Targeted airdrops, exclusive communities
- **KYC/AML**: Privacy-preserving compliance checks
- **DAO Governance**: Weighted voting based on demographics
- **Gaming**: Age-appropriate content filtering
- **Finance**: Age-restricted investment products

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [FHEVM Docs](https://docs.zama.ai)
- **Community**: [Zama Discord](https://discord.gg/zama)
- **Issues**: [GitHub Issues](https://github.com/zama-ai/fhevm/issues)

---

**Built with privacy-preserving FHE technology by Zama**
