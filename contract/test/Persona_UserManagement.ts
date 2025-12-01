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
  alice: {
    year: 2004,
    month: 12,
    day: 1,
    gender: Gender.Female,
  },
  // bob age 28
  bob: {
    year: 1995,
    month: 6,
    day: 15,
    gender: Gender.Male,
  },
  charlie: {
    year: 2010,
    month: 3,
    day: 30,
    gender: Gender.Other,
  },
  dave: {
    year: 1975,
    month: 7,
    day: 20,
    gender: Gender.Male,
  },
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

describe("Persona - User Management", function () {
  let signers: Signers;
  let personaContract: Persona;
  let personaContractAddress: string;

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

    ({ personaContract, personaContractAddress } = await deployFixture());
  });

  describe("Basic store & retrieve function", function () {
    describe("Alice stores valid persona data", function () {
      const { year, month, day, gender } = data.alice;
      beforeEach(async function () {
        const inputBirthday = await generateUnixTimestamp(year, month, day);
        await storePersonaData(personaContractAddress, personaContract, signers.alice, inputBirthday, gender);
      });

      it("Alice can retrieve and decrypt her persona data", async function () {
        const storedData = await personaContract.getUserData(signers.alice.address);

        const decryptedBirthday = await fhevm.userDecryptEuint(
          FhevmType.euint64,
          storedData[0],
          personaContractAddress,
          signers.alice,
        );
        const decryptedGender = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          storedData[1],
          personaContractAddress,
          signers.alice,
        );

        const decryptedYear = new Date(Number(decryptedBirthday) * 1000).getUTCFullYear();
        const decryptedMonth = new Date(Number(decryptedBirthday) * 1000).getUTCMonth() + 1;
        const decryptedDay = new Date(Number(decryptedBirthday) * 1000).getUTCDate();

        expect(decryptedYear).to.equal(year);
        expect(decryptedMonth).to.equal(month);
        expect(decryptedDay).to.equal(day);
        expect(Number(decryptedGender)).to.equal(gender);
      });

      it("Second valid submission by Alice does not overwrite first valid data", async function () {
        const newYear = 2010;
        const newMonth = 5;
        const newDay = 15;
        const newGender = Gender.Female;
        const newBirthday = await generateUnixTimestamp(newYear, newMonth, newDay);

        await storePersonaData(personaContractAddress, personaContract, signers.alice, newBirthday, newGender);

        const storedData = await personaContract.getUserData(signers.alice.address);

        const decryptedBirthday = await fhevm.userDecryptEuint(
          FhevmType.euint64,
          storedData[0],
          personaContractAddress,
          signers.alice,
        );
        const decryptedGender = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          storedData[1],
          personaContractAddress,
          signers.alice,
        );

        const decryptedYear = new Date(Number(decryptedBirthday) * 1000).getUTCFullYear();
        const decryptedMonth = new Date(Number(decryptedBirthday) * 1000).getUTCMonth() + 1;
        const decryptedDay = new Date(Number(decryptedBirthday) * 1000).getUTCDate();

        // tetap data pertama
        expect(decryptedYear).to.equal(year);
        expect(decryptedMonth).to.equal(month);
        expect(decryptedDay).to.equal(day);
        expect(Number(decryptedGender)).to.equal(gender);
      });
      it("Second invalid submission by Alice does not overwrite first valid data", async function () {
        const newYear = 2026;
        const newMonth = 5;
        const newDay = 15;
        const newGender = Gender.Female;
        const newBirthday = await generateUnixTimestamp(newYear, newMonth, newDay);

        await storePersonaData(personaContractAddress, personaContract, signers.alice, newBirthday, newGender);

        const storedData = await personaContract.getUserData(signers.alice.address);

        const decryptedBirthday = await fhevm.userDecryptEuint(
          FhevmType.euint64,
          storedData[0],
          personaContractAddress,
          signers.alice,
        );
        const decryptedGender = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          storedData[1],
          personaContractAddress,
          signers.alice,
        );

        const decryptedYear = new Date(Number(decryptedBirthday) * 1000).getUTCFullYear();
        const decryptedMonth = new Date(Number(decryptedBirthday) * 1000).getUTCMonth() + 1;
        const decryptedDay = new Date(Number(decryptedBirthday) * 1000).getUTCDate();

        // tetap data pertama
        expect(decryptedYear).to.equal(year);
        expect(decryptedMonth).to.equal(month);
        expect(decryptedDay).to.equal(day);
        expect(Number(decryptedGender)).to.equal(gender);
      });

      it("Other users cannot decrypt Alice's stored persona data", async function () {
        // Bob try to retrieve Alice's data
        const aliceData = await personaContract.connect(signers.bob).getUserData(signers.alice.address);

        // Boob see encrypted data only
        await expect(aliceData[0]).to.be.a.string;
        await expect(aliceData[1]).to.be.a.string;

        // Bob cannot decrypt Alice's data
        await expect(fhevm.userDecryptEuint(FhevmType.euint64, aliceData[0], personaContractAddress, signers.bob)).to.be
          .rejected;
        await expect(fhevm.userDecryptEuint(FhevmType.euint8, aliceData[1], personaContractAddress, signers.bob)).to.be
          .rejected;
      });
    });

    describe("Bob tries to store invalid persona data", function () {
      const invalidYear = 2026; // future year
      const invalidMonth = 1;
      const invalidDay = 1;
      const invalidGender = Gender.FalseValue;
      beforeEach(async function () {
        const invalidBirthday = await generateUnixTimestamp(invalidYear, invalidMonth, invalidDay);
        await storePersonaData(personaContractAddress, personaContract, signers.bob, invalidBirthday, invalidGender);
      });

      // Bob's invalid data is stored, but the "validation" value is encrypted false
      it("Bob's invalid persona data is stored, but flag is encrypted false", async function () {
        const storedData = await personaContract.getUserData(signers.bob.address);

        // saved data should be retrievable as encrypted values
        await expect(storedData[0]).to.be.a.string;
        await expect(storedData[1]).to.be.a.string;
        await expect(storedData[2]).to.be.a.string;

        const validationFlag = await fhevm.userDecryptEbool(storedData[2], personaContractAddress, signers.bob);
        expect(Number(validationFlag)).to.equal(0);
      });
      it("Bob submits valid persona data after invalid submission and it is stored correctly", async function () {
        const { year, month, day, gender } = data.bob;
        const validBirthday = await generateUnixTimestamp(year, month, day);
        await storePersonaData(personaContractAddress, personaContract, signers.bob, validBirthday, gender);

        // retrieve stored data
        const storedData = await personaContract.getUserData(signers.bob.address);
        const decryptedBirthday = await fhevm.userDecryptEuint(
          FhevmType.euint64,
          storedData[0],
          personaContractAddress,
          signers.bob,
        );
        const decryptedGender = await fhevm.userDecryptEuint(
          FhevmType.euint8,
          storedData[1],
          personaContractAddress,
          signers.bob,
        );

        const decryptedYear = new Date(Number(decryptedBirthday) * 1000).getUTCFullYear();
        const decryptedMonth = new Date(Number(decryptedBirthday) * 1000).getUTCMonth() + 1;
        const decryptedDay = new Date(Number(decryptedBirthday) * 1000).getUTCDate();

        expect(decryptedYear).to.equal(data.bob.year);
        expect(decryptedMonth).to.equal(data.bob.month);
        expect(decryptedDay).to.equal(data.bob.day);
        expect(Number(decryptedGender)).to.equal(data.bob.gender);
      });
      it("Other users never know wheter Bob's stored data is valid or invalid", async function () {
        // Charlie try to retrieve Bob's data
        const bobData = await personaContract.connect(signers.charlie).getUserData(signers.bob.address);
        // Charlie see encrypted data only
        await expect(bobData[0]).to.be.a.string;
        await expect(bobData[1]).to.be.a.string;
        await expect(bobData[2]).to.be.a.string;
        // Charlie cannot decrypt Bob's data
        await expect(fhevm.userDecryptEuint(FhevmType.euint64, bobData[0], personaContractAddress, signers.charlie)).to
          .be.rejected;
        await expect(fhevm.userDecryptEuint(FhevmType.euint8, bobData[1], personaContractAddress, signers.charlie)).to
          .be.rejected;
        await expect(fhevm.userDecryptEbool(bobData[2], personaContractAddress, signers.charlie)).to.be.rejected;
      });
    });

    describe("No one can call verification function directly", function () {
      it("Should failed if unauthorized user calls isAgeAtLeast", async function () {
        await expect(personaContract.isAgeAtLeast(signers.alice.address, 18)).to.be.rejected;
        await expect(personaContract.connect(signers.bob).isAgeAtLeast(signers.alice.address, 18)).to.be.rejected;
      });
      it("Should failed if unauthorized user calls isAgeBetween", async function () {
        await expect(personaContract.isAgeBetween(signers.alice.address, 18, 30)).to.be.rejected;
        await expect(personaContract.connect(signers.bob).isAgeBetween(signers.alice.address, 18, 30)).to.be.rejected;
      });
      it("Should failed if unauthorized user calls hasGender", async function () {
        await expect(personaContract.hasGender(signers.alice.address, Gender.Female)).to.be.rejected;
        await expect(personaContract.connect(signers.bob).hasGender(signers.alice.address, Gender.Female)).to.be
          .rejected;
      });
      // isMale and isFemale
      it("Should failed if unauthorized user calls isMale or isFemale", async function () {
        await expect(personaContract.isMale(signers.alice.address)).to.be.rejected;
        await expect(personaContract.isFemale(signers.alice.address)).to.be.rejected;
        await expect(personaContract.connect(signers.bob).isMale(signers.alice.address)).to.be.rejected;
        await expect(personaContract.connect(signers.bob).isFemale(signers.alice.address)).to.be.rejected;
      });
    });
  });

  describe("Administrative functions", function () {
    describe("Elon deploy PersonaMock and Deployer set adapter as verifier", function () {
      let adapterContract: PersonaMock;
      let adapterContractAddress: string;
      beforeEach(async function () {
        // elon deploy PersonaMock
        const adapterFactory = (await ethers.getContractFactory("PersonaMock", signers.elon)) as PersonaMock__factory;
        adapterContract = (await adapterFactory.connect(signers.elon).deploy(personaContractAddress)) as PersonaMock;
        adapterContractAddress = await adapterContract.getAddress();

        // deployer set adapter as verifier in persona contract
        const tx = await personaContract.connect(signers.deployer).setVerifier(adapterContractAddress, true);
        await tx.wait();

        // alice, bob, and charlie store valid data for testing adapter verifier later
        const { alice, bob, charlie } = data;
        // store alice
        const inputBirthdayAlice = await generateUnixTimestamp(alice.year, alice.month, alice.day);
        await storePersonaData(
          personaContractAddress,
          personaContract,
          signers.alice,
          inputBirthdayAlice,
          alice.gender,
        );

        // store bob
        const inputBirthdayBob = await generateUnixTimestamp(bob.year, bob.month, bob.day);
        await storePersonaData(personaContractAddress, personaContract, signers.bob, inputBirthdayBob, bob.gender);

        // store charlie
        const inputBirthdayCharlie = await generateUnixTimestamp(charlie.year, charlie.month, charlie.day);
        await storePersonaData(
          personaContractAddress,
          personaContract,
          signers.charlie,
          inputBirthdayCharlie,
          charlie.gender,
        );
      });
      it("Verifier is set correctly in Persona contract", async function () {
        const isVerifier = await personaContract.isVerifier(adapterContractAddress);
        expect(isVerifier).to.equal(true);
      });
      it("Adapter can call function correctly after being set as verifier", async function () {
        await adapterContract.connect(signers.alice).conditionalIncrement();
        const result = await adapterContract.getCounter(signers.alice.address);
        const decryptedResult = await fhevm.userDecryptEuint(
          FhevmType.euint32,
          result,
          adapterContractAddress,
          signers.alice,
        );
        expect(Number(decryptedResult)).to.equal(1);
      });
      it("Admin transfer verifier role to Elon", async function () {
        // deployer set elon as verifier in persona contract
        // owner is deployer
        const owner = await personaContract.owner();
        expect(owner).to.equal(await signers.deployer.getAddress());
        const tx = await personaContract.connect(signers.deployer).transferOwnership(signers.elon.address);
        await tx.wait();
        const newOwner = await personaContract.owner();
        expect(newOwner).to.equal(await signers.elon.getAddress());
      });
      it("New admin can set another verifier. Old admin cannot set verifier", async function () {
        // Deploy another verifier contract for this test
        const anotherVerifierFactory = (await ethers.getContractFactory(
          "PersonaMock",
          signers.elon,
        )) as PersonaMock__factory;
        const anotherVerifier = await anotherVerifierFactory.deploy(personaContractAddress);
        const anotherVerifierAddress = await anotherVerifier.getAddress();

        // deployer transfer ownership to elon
        let tx = await personaContract.connect(signers.deployer).transferOwnership(signers.elon.address);
        await tx.wait();

        // old admin (deployer) try to set another verifier contract - should fail
        await expect(personaContract.connect(signers.deployer).setVerifier(anotherVerifierAddress, true)).to.be
          .rejected;

        // new admin (elon) set another verifier contract - should succeed
        tx = await personaContract.connect(signers.elon).setVerifier(anotherVerifierAddress, true);
        await tx.wait();
        const isAnotherVerifier = await personaContract.isVerifier(anotherVerifierAddress);
        expect(isAnotherVerifier).to.equal(true);
      });
      it("Should only set contract address as verifier", async function () {
        // example contract address to be set as verifier
        // Deploy example verifier contracts
        const exampleVerifierFactory = (await ethers.getContractFactory(
          "PersonaMock",
          signers.deployer,
        )) as PersonaMock__factory;
        const exampleVerifier = await exampleVerifierFactory.deploy(personaContractAddress);
        const exampleVerifierAddress = await exampleVerifier.getAddress();

        // deployer transfer ownership to elon
        const tx = await personaContract.connect(signers.deployer).transferOwnership(signers.elon.address);
        await tx.wait();
        // new admin (elon) set exampleVerifier as verifier - should succeed
        const tx2 = await personaContract.connect(signers.elon).setVerifier(exampleVerifierAddress, true);
        await tx2.wait();
        // new admin (elon) try to set EOA (alice) as verifier - should fail
        await expect(personaContract.connect(signers.elon).setVerifier(await signers.alice.getAddress(), true)).to.be
          .reverted;
        // new admin (elon) try to set zero address as verifier - should fail
        await expect(personaContract.connect(signers.elon).setVerifier(ethers.ZeroAddress, true)).to.be.reverted;
      });
    });
  });
});
