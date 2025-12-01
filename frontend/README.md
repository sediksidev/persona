# Persona Frontend - Privacy-Preserving Identity Interface

A Next.js web application that provides a user-friendly interface for interacting with the Persona protocol. Users can register their encrypted identity and developers can explore integration examples.

## 🎯 Overview

This frontend demonstrates how to build privacy-preserving applications using Zama's Fully Homomorphic Encryption (FHE) technology. It showcases client-side encryption, encrypted data submission, and decryption workflows.

**Live Demo**: [Add your deployment URL]

### Connected Contracts

**Network**: Sepolia Testnet (Zama fhEVM)

- **Persona**: `0xc0cF5CC4348bE7D1E447B4EC5B5ee440A2C81Eb7`
- **PersonaMock**: `0x9B38E8348BCaFf9BbFA182fDBA005d15c6f0fD2B`

## ✨ Features

### For Users

- **🔐 Registration**: Encrypt and store birthday + gender on-chain
- **👁️ View Data**: See your encrypted data stored on the blockchain
- **🔓 Decrypt**: Decrypt your data using your wallet signature
- **🎨 Modern UI**: Clean, responsive interface built with Tailwind CSS

### For Developers

- **📚 Use Cases**: 4 live integration examples showing real smart contract interactions
- **🧪 Interactive Testing**: Execute and decrypt contract calls in real-time
- **📖 How-To Guide**: Step-by-step integration documentation

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Web3**: Wagmi 2.x + Viem 2.x
- **FHE**: Custom fhEVM React hooks
- **Wallet**: ConnectKit for wallet connection

### Project Structure

```
frontend/
├── app/                      # Next.js pages
│   ├── page.tsx              # Home / Registration
│   ├── use-cases/            # Integration examples
│   │   ├── page.tsx
│   │   ├── VoteExample.tsx
│   │   ├── ViewExample.tsx
│   │   ├── ClaimExample.tsx
│   │   └── IncrementExample.tsx
│   └── how-to/               # Developer guide
│       └── page.tsx
├── components/               # Reusable UI components
│   ├── RegistrationForm.tsx
│   ├── UserDataModal.tsx
│   ├── Header.tsx
│   └── Layout.tsx
├── hooks/                    # Custom React hooks
│   ├── useRegistration.ts    # Registration logic
│   ├── useUserData.ts        # Data fetching & decryption
│   ├── useVote.ts            # Voting example
│   ├── useView.ts            # View example
│   ├── useClaim.ts           # Claim example
│   └── useIncrement.ts       # Increment example
├── lib/fhevm-react/          # FHE utilities
│   ├── useFhevm.tsx          # FHE context provider
│   └── fhevmTypes.ts         # Type definitions
├── services/                 # External services
│   ├── contracts/
│   │   ├── config.ts         # Contract addresses & ABIs
│   │   └── abis/
│   └── fhevm/
│       ├── FhevmProvider.tsx
│       └── useFhevmContext.ts
└── styles/
    └── design-system.ts      # Centralized design tokens
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Package manager
- **MetaMask**: or any Web3 wallet

### Installation

1. **Clone the repository**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the frontend directory:

   ```bash
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
   ```

   - **NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID**: Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
   - **NEXT_PUBLIC_ALCHEMY_ID**: Get your API key from [Alchemy Dashboard](https://dashboard.alchemy.com)

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Configuration

Update contract addresses in `services/contracts/config.ts`:

```typescript
export const contractsConfig = {
  address: {
    persona: "0xc0cF5CC4348bE7D1E447B4EC5B5ee440A2C81Eb7",
    mock: "0x9B38E8348BCaFf9BbFA182fDBA005d15c6f0fD2B",
  },
  // ...
};
```

## 📖 User Guide

### 1. Registration Flow

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Enter Data**:
   - Birthday: Select your birth date
   - Gender: Choose Male (1), Female (2), or Other (3)
3. **Encrypt**: Click "Register" - data is encrypted client-side
4. **Submit**: Encrypted data is sent to the Persona contract
5. **Confirmation**: Transaction must be confirmed in your wallet

### 2. View Your Data

1. Click **"See My Data"** button after registration
2. Modal shows your encrypted data (66-character hex strings)
3. Click **"Decrypt All"** to reveal actual values
4. Sign decryption request in your wallet

### 3. Try Use Cases

Navigate to **Use Cases** page to interact with example contracts:

- **Vote**: Submit vote (requires age > 18)
- **View Content**: Access content (requires female gender)
- **Claim Reward**: Claim airdrop (requires male & age < 30)
- **Increment Counter**: Track engagement (requires age ≥ 18)

Each example shows encrypted counters that only increment if conditions are met!

> **💡 Important**: Transactions will **never revert** due to failed conditions. Instead, the contract state simply won't change if you don't meet requirements. This is because Persona returns encrypted booleans (`ebool`), enabling privacy-preserving conditional logic without exposing verification results on-chain.

## 🔧 Development Guide

### Key Hooks

**`useRegistration`**
```typescript
const {
  birthday,
  gender,
  isSubmitting,
  success,
  error,
  handleSubmit,
} = useRegistration();
```

**`useUserData`**
```typescript
const {
  userData,           // Encrypted handles
  decryptedData,      // Decrypted values
  fetchUserData,      // Load from contract
  decryptAllData,     // Decrypt handles
} = useUserData();
```

**`useVote`** (and similar)
```typescript
const {
  vote,               // Submit vote transaction
  decryptVoteCount,   // Decrypt vote count
  decryptedCount,     // Result
} = useVote();
```

### FHE Workflow

**Encryption (Client-Side)**
```typescript
// 1. Create FHE instance
const { instance } = useFhevmContext();

// 2. Encrypt value
const encryptedBirthday = await instance.encrypt_uint64(timestampInSeconds);

// 3. Get handle (for contract)
const handle = encryptedBirthday.handle;
const attestation = encryptedBirthday.attestation;
```

**Decryption (Client-Side)**
```typescript
// 1. Get encrypted handle from contract
const encryptedData = await contract.read.getUserData([address]);

// 2. Request decryption signature
const { userDecrypt } = useFheDecryption();

// 3. Decrypt array of handles
const decrypted = await userDecrypt(
  [handle1, handle2, handle3],
  contractAddress
);

// 4. Access decrypted values
const value = decrypted[handle1]; // Returns bigint or boolean
```

### Adding New Use Cases

1. Create hook in `hooks/useYourExample.ts`
2. Use `useWriteContract` for transactions
3. Use `useReadContract` for reading encrypted data
4. Implement decrypt logic with `useFheDecryption`
5. Create component in `app/use-cases/YourExample.tsx`
6. Add to examples list in `app/use-cases/examples.ts`

## 🎨 Design System

Centralized design tokens in `styles/design-system.ts`:

```typescript
import { typography, spacing, buttons, cards } from "@/styles/design-system";

<button className={`${buttons.primary} ${buttons.fullWidth}`}>
  Submit
</button>
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔐 Security Considerations

1. **Client-Side Encryption**: All sensitive data is encrypted before leaving the browser
2. **Signature Verification**: Decryption requires wallet signature
3. **No Raw Data Storage**: Contract only stores encrypted handles
4. **One-Time Registration**: Users cannot change data after validation
5. **HTTPS Required**: FHE operations require secure context

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Create `.env.local` with the following variables:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
```

**Required for:**
- WalletConnect integration (wallet connection)
- Alchemy RPC provider (Sepolia network access)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Zama fhEVM SDK](https://docs.zama.ai/fhevm)
- [Tailwind CSS](https://tailwindcss.com)

## 🐛 Troubleshooting

**Wallet not connecting?**
- Ensure you're on Sepolia testnet (Zama fhEVM)
- Check MetaMask is unlocked
- Verify environment variables are set correctly
- Try refreshing the page

**Encryption failing?**
- Check console for errors
- Ensure FHE instance is loaded
- Verify birthday is a valid date

**Decryption not working?**
- Ensure you've registered data first
- Sign the decryption request in wallet
- Check contract has your encrypted data

**Transaction failing?**
- Ensure you have testnet ETH
- Check you meet the condition (age/gender)
- Verify contract is authorized as verifier

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: See `/how-to` page in the app
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Community**: [Zama Discord](https://discord.gg/zama)

---

**Built with Next.js, Wagmi, and Zama's FHE technology**
