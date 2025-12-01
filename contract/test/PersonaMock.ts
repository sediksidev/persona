import { ethers, fhevm } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Persona, Persona__factory, PersonaMock, PersonaMock__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  charlie: HardhatEthersSigner;
  dave: HardhatEthersSigner;
  elon: HardhatEthersSigner;
};

enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  Other = 3,
  FalseValue = 255,
}

const data = {
  // alice age 20, female
  alice: {
    year: 2004,
    month: 12,
    day: 1,
    gender: Gender.Female,
  },
  // bob age 28, male
  bob: {
    year: 1997,
    month: 6,
    day: 15,
    gender: Gender.Male,
  },
  // charlie age 14, other
  charlie: {
    year: 2010,
    month: 3,
    day: 30,
    gender: Gender.Other,
  },
  // dave age 49, male
  dave: {
    year: 1975,
    month: 7,
    day: 20,
    gender: Gender.Male,
  },
  // elon age 25, male
  elon: {
    year: 1999,
    month: 6,
    day: 28,
    gender: Gender.Male,
  },
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("Persona")) as Persona__factory;
  const personaContract = (await factory.deploy()) as Persona;
  const personaContractAddress = await personaContract.getAddress();

  return { personaContract, personaContractAddress };
}

async function generateUnixTimestamp(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
): Promise<number> {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return Math.floor(date.getTime() / 1000);
}

// helper: encrypt & store persona data untuk signer tertentu
async function storePersonaData(
  personaAddress: string,
  persona: Persona,
  signer: HardhatEthersSigner,
  birthdayTs: number,
  gender: Gender,
) {
  const encryptedInput = await fhevm
    .createEncryptedInput(personaAddress, signer.address)
    .add64(birthdayTs)
    .add8(gender)
    .encrypt();

  const tx = await persona
    .connect(signer)
    .store(encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.inputProof);
  await tx.wait();
}

describe("PersonaMock - Verification Tests", function () {
  let signers: Signers;
  let personaContract: Persona;
  let personaContractAddress: string;
  let mockContract: PersonaMock;
  let mockContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      alice: ethSigners[1],
      bob: ethSigners[2],
      charlie: ethSigners[3],
      dave: ethSigners[4],
      elon: ethSigners[5],
    };
  });

  beforeEach(async function () {
    // Only run on FHEVM mock
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    // Deploy Persona contract
    ({ personaContract, personaContractAddress } = await deployFixture());

    // Deploy PersonaMock contract
    const mockFactory = (await ethers.getContractFactory("PersonaMock", signers.deployer)) as PersonaMock__factory;
    mockContract = (await mockFactory.deploy(personaContractAddress)) as PersonaMock;
    mockContractAddress = await mockContract.getAddress();

    // Set PersonaMock as verifier
    const tx = await personaContract.connect(signers.deployer).setVerifier(mockContractAddress, true);
    await tx.wait();

    // Store valid persona data for all users
    for (const [name, user] of Object.entries(data)) {
      const signer = signers[name as keyof typeof signers];
      const birthdayTs = await generateUnixTimestamp(user.year, user.month, user.day);
      await storePersonaData(personaContractAddress, personaContract, signer, birthdayTs, user.gender);
    }
  });

  describe("TEST 1: Conditional Increment (Adult >= 18)", function () {
    it("Alice (20 years old) can increment counter", async function () {
      await mockContract.connect(signers.alice).conditionalIncrement();
      const counter = await mockContract.getCounter(signers.alice.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, counter, mockContractAddress, signers.alice);
      expect(Number(decrypted)).to.equal(1);
    });

    it("Bob (28 years old) can increment counter", async function () {
      await mockContract.connect(signers.bob).conditionalIncrement();
      const counter = await mockContract.getCounter(signers.bob.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, counter, mockContractAddress, signers.bob);
      expect(Number(decrypted)).to.equal(1);
    });

    it("Charlie (14 years old) cannot increment counter", async function () {
      await mockContract.connect(signers.charlie).conditionalIncrement();
      const counter = await mockContract.getCounter(signers.charlie.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, counter, mockContractAddress, signers.charlie);
      expect(Number(decrypted)).to.equal(0);
    });

    it("Dave (49 years old) can increment counter multiple times", async function () {
      await mockContract.connect(signers.dave).conditionalIncrement();
      await mockContract.connect(signers.dave).conditionalIncrement();
      await mockContract.connect(signers.dave).conditionalIncrement();
      const counter = await mockContract.getCounter(signers.dave.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, counter, mockContractAddress, signers.dave);
      expect(Number(decrypted)).to.equal(3);
    });
  });

  describe("TEST 2: Vote (Age > 18, which is >= 19)", function () {
    it("Alice (20 years old) can vote", async function () {
      await mockContract.connect(signers.alice).vote();
      const voteCount = await mockContract.getVoteCount(signers.alice.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, voteCount, mockContractAddress, signers.alice);
      expect(Number(decrypted)).to.equal(1);
    });

    it("Elon (25 years old) can vote multiple times", async function () {
      await mockContract.connect(signers.elon).vote();
      await mockContract.connect(signers.elon).vote();
      const voteCount = await mockContract.getVoteCount(signers.elon.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, voteCount, mockContractAddress, signers.elon);
      expect(Number(decrypted)).to.equal(2);
    });

    it("Charlie (14 years old) cannot vote", async function () {
      await mockContract.connect(signers.charlie).vote();
      const voteCount = await mockContract.getVoteCount(signers.charlie.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, voteCount, mockContractAddress, signers.charlie);
      expect(Number(decrypted)).to.equal(0);
    });

    it("Bob (28 years old) can vote", async function () {
      await mockContract.connect(signers.bob).vote();
      const voteCount = await mockContract.getVoteCount(signers.bob.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, voteCount, mockContractAddress, signers.bob);
      expect(Number(decrypted)).to.equal(1);
    });
  });

  describe("TEST 3: View Content (Female Only)", function () {
    it("Alice (Female) can view content", async function () {
      await mockContract.connect(signers.alice).viewContent();
      const viewCount = await mockContract.getViewCount(signers.alice.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, viewCount, mockContractAddress, signers.alice);
      expect(Number(decrypted)).to.equal(1);
    });

    it("Alice (Female) can view content multiple times", async function () {
      await mockContract.connect(signers.alice).viewContent();
      await mockContract.connect(signers.alice).viewContent();
      await mockContract.connect(signers.alice).viewContent();
      const viewCount = await mockContract.getViewCount(signers.alice.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, viewCount, mockContractAddress, signers.alice);
      expect(Number(decrypted)).to.equal(3);
    });

    it("Bob (Male) cannot view content", async function () {
      await mockContract.connect(signers.bob).viewContent();
      const viewCount = await mockContract.getViewCount(signers.bob.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, viewCount, mockContractAddress, signers.bob);
      expect(Number(decrypted)).to.equal(0);
    });

    it("Charlie (Other) cannot view content", async function () {
      await mockContract.connect(signers.charlie).viewContent();
      const viewCount = await mockContract.getViewCount(signers.charlie.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, viewCount, mockContractAddress, signers.charlie);
      expect(Number(decrypted)).to.equal(0);
    });

    it("Dave (Male) cannot view content", async function () {
      await mockContract.connect(signers.dave).viewContent();
      const viewCount = await mockContract.getViewCount(signers.dave.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, viewCount, mockContractAddress, signers.dave);
      expect(Number(decrypted)).to.equal(0);
    });
  });

  describe("TEST 4: Claim Reward (Male AND Age < 30)", function () {
    it("Elon (25 years old Male) can claim reward", async function () {
      await mockContract.connect(signers.elon).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.elon.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, claimCount, mockContractAddress, signers.elon);
      expect(Number(decrypted)).to.equal(1);
    });

    it("Elon (25 years old Male) can claim reward multiple times", async function () {
      await mockContract.connect(signers.elon).claimReward();
      await mockContract.connect(signers.elon).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.elon.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, claimCount, mockContractAddress, signers.elon);
      expect(Number(decrypted)).to.equal(2);
    });

    it("Bob (28 years old Male) can claim reward", async function () {
      await mockContract.connect(signers.bob).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.bob.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, claimCount, mockContractAddress, signers.bob);
      expect(Number(decrypted)).to.equal(1);
    });

    it("Alice (20 years old Female) cannot claim reward - wrong gender", async function () {
      await mockContract.connect(signers.alice).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.alice.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, claimCount, mockContractAddress, signers.alice);
      expect(Number(decrypted)).to.equal(0);
    });

    it("Dave (49 years old Male) cannot claim reward - too old", async function () {
      await mockContract.connect(signers.dave).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.dave.address);
      const decrypted = await fhevm.userDecryptEuint(FhevmType.euint8, claimCount, mockContractAddress, signers.dave);
      expect(Number(decrypted)).to.equal(0);
    });

    it("Charlie (14 years old Other) cannot claim reward - wrong gender", async function () {
      await mockContract.connect(signers.charlie).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.charlie.address);
      const decrypted = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        claimCount,
        mockContractAddress,
        signers.charlie,
      );
      expect(Number(decrypted)).to.equal(0);
    });
  });

  describe("Combined Tests", function () {
    it("Alice can view and vote, but cannot claim", async function () {
      // View (Female) - should work
      await mockContract.connect(signers.alice).viewContent();
      const viewCount = await mockContract.getViewCount(signers.alice.address);
      const decryptedView = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        viewCount,
        mockContractAddress,
        signers.alice,
      );
      expect(Number(decryptedView)).to.equal(1);

      // Vote (age 20 > 18) - should work
      await mockContract.connect(signers.alice).vote();
      const voteCount = await mockContract.getVoteCount(signers.alice.address);
      const decryptedVote = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        voteCount,
        mockContractAddress,
        signers.alice,
      );
      expect(Number(decryptedVote)).to.equal(1);

      // Claim (not male) - should not work
      await mockContract.connect(signers.alice).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.alice.address);
      const decryptedClaim = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        claimCount,
        mockContractAddress,
        signers.alice,
      );
      expect(Number(decryptedClaim)).to.equal(0);
    });

    it("Elon can vote and claim, but cannot view", async function () {
      // Vote (age 25 > 18) - should work
      await mockContract.connect(signers.elon).vote();
      const voteCount = await mockContract.getVoteCount(signers.elon.address);
      const decryptedVote = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        voteCount,
        mockContractAddress,
        signers.elon,
      );
      expect(Number(decryptedVote)).to.equal(1);

      // Claim (male, age 25 < 30) - should work
      await mockContract.connect(signers.elon).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.elon.address);
      const decryptedClaim = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        claimCount,
        mockContractAddress,
        signers.elon,
      );
      expect(Number(decryptedClaim)).to.equal(1);

      // View (not female) - should not work
      await mockContract.connect(signers.elon).viewContent();
      const viewCount = await mockContract.getViewCount(signers.elon.address);
      const decryptedView = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        viewCount,
        mockContractAddress,
        signers.elon,
      );
      expect(Number(decryptedView)).to.equal(0);
    });

    it("Charlie cannot do anything except conditional increment", async function () {
      // Vote (age 14 not > 18) - should not work
      await mockContract.connect(signers.charlie).vote();
      const voteCount = await mockContract.getVoteCount(signers.charlie.address);
      const decryptedVote = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        voteCount,
        mockContractAddress,
        signers.charlie,
      );
      expect(Number(decryptedVote)).to.equal(0);

      // View (not female) - should not work
      await mockContract.connect(signers.charlie).viewContent();
      const viewCount = await mockContract.getViewCount(signers.charlie.address);
      const decryptedView = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        viewCount,
        mockContractAddress,
        signers.charlie,
      );
      expect(Number(decryptedView)).to.equal(0);

      // Claim (not male) - should not work
      await mockContract.connect(signers.charlie).claimReward();
      const claimCount = await mockContract.getClaimCount(signers.charlie.address);
      const decryptedClaim = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        claimCount,
        mockContractAddress,
        signers.charlie,
      );
      expect(Number(decryptedClaim)).to.equal(0);

      // Conditional increment (age 14 not >= 18) - should not work
      await mockContract.connect(signers.charlie).conditionalIncrement();
      const counter = await mockContract.getCounter(signers.charlie.address);
      const decryptedCounter = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        counter,
        mockContractAddress,
        signers.charlie,
      );
      expect(Number(decryptedCounter)).to.equal(0);
    });
  });
});
