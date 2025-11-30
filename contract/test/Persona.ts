import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { Persona, Persona__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";
// import { FhevmType } from "@fhevm/hardhat-plugin";

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
}

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

describe("Persona", function () {
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
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ personaContract, personaContractAddress } = await deployFixture());
  });
  describe("Alice correctly submit persona data", async function () {
    const year = 200;
    const month = 12;
    const day = 1;
    const inputGender = Gender.Male;

    beforeEach(async function () {
      const inputBirthday = await generateUnixTimestamp(year, month, day); // it means 19 April 2002 in unix timestamp
      // create encrypted inputs
      const encryptedInput = await fhevm
        .createEncryptedInput(personaContractAddress, signers.alice.address)
        .add64(inputBirthday)
        .add8(inputGender)
        .encrypt();

      const tx = await personaContract
        .connect(signers.alice)
        .store(encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.inputProof);
      await tx.wait();
    });

    it("- successfully retrieves and decrypts stored persona data", async function () {
      // retrieve stored data
      const storedData = await personaContract.getUserData(signers.alice.address);
      // decrypting stored values
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
      const decryptedMonth = new Date(Number(decryptedBirthday) * 1000).getUTCMonth() + 1; // Months are zero-based
      const decryptedDay = new Date(Number(decryptedBirthday) * 1000).getUTCDate();

      expect(decryptedYear).to.equal(year);
      expect(decryptedMonth).to.equal(month);
      expect(decryptedDay).to.equal(day);
      expect(Number(decryptedGender)).to.equal(Gender.Male);
    });
  });
});
