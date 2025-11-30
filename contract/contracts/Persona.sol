// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, euint8, ebool, externalEuint64, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Persona - Encrypted Identity Layer
/// @notice Protocol layer to store encrypted personal attributes (birthday, gender) and verify conditions.
contract Persona is ZamaEthereumConfig {
    address public owner;
    mapping(address => bool) private _verifiers;

    mapping(address => euint64) private _birthdays;
    mapping(address => euint8) private _genders;
    mapping(address => ebool) private _validations;

    event VerifierUpdated(address indexed verifier, bool allowed);
    event OwnershipTransferred(address indexed from, address indexed to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyVerifier() {
        require(_verifiers[msg.sender], "Not verifier");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setVerifier(address verifier, bool allowed) external onlyOwner {
        require(isContract(verifier), "Verifier must be contract");
        _verifiers[verifier] = allowed;
        emit VerifierUpdated(verifier, allowed);
    }

    function isVerifier(address addr) external view returns (bool) {
        return _verifiers[addr];
    }

    function store(
        externalEuint64 encryptedBirthday,
        externalEuint8 encryptedGender,
        bytes calldata attestation
    ) external {
        euint64 nowEnc = FHE.asEuint64(uint64(block.timestamp));

        euint64 birth = FHE.fromExternal(encryptedBirthday, attestation);
        euint8 gender = FHE.fromExternal(encryptedGender, attestation);

        ebool validBirth = FHE.lt(birth, nowEnc);
        ebool validGender = FHE.and(FHE.lt(gender, FHE.asEuint8(4)), FHE.gt(gender, FHE.asEuint8(0)));
        ebool valid = FHE.and(validBirth, validGender);

        euint64 storedBirth = FHE.select(valid, birth, FHE.asEuint64(0));
        euint8 storedGender = FHE.select(valid, gender, FHE.asEuint8(0));

        bool initialized = FHE.isInitialized(_validations[msg.sender]);

        _birthdays[msg.sender] = initialized
            ? FHE.select(_validations[msg.sender], _birthdays[msg.sender], storedBirth)
            : storedBirth;

        _genders[msg.sender] = initialized
            ? FHE.select(_validations[msg.sender], _genders[msg.sender], storedGender)
            : storedGender;

        _validations[msg.sender] = initialized
            ? FHE.select(_validations[msg.sender], _validations[msg.sender], valid)
            : valid;

        FHE.allow(_birthdays[msg.sender], msg.sender);
        FHE.allow(_genders[msg.sender], msg.sender);
        FHE.allow(_validations[msg.sender], msg.sender);

        FHE.allow(_birthdays[msg.sender], address(this));
        FHE.allow(_genders[msg.sender], address(this));
        FHE.allow(_validations[msg.sender], address(this));
    }

    function getUserData(address user) external view returns (euint64, euint8, ebool) {
        return (_birthdays[user], _genders[user], _validations[user]);
    }

    function _computeAge(address user) internal returns (euint64) {
        require(FHE.isInitialized(_birthdays[user]), "Uninitialized");
        return FHE.sub(FHE.asEuint64(uint64(block.timestamp)), _birthdays[user]);
    }

    function isAgeAtLeast(address user, uint8 minYears) external onlyVerifier returns (ebool) {
        euint64 age = _computeAge(user);
        euint64 threshold = FHE.mul(FHE.asEuint64(365 days), FHE.asEuint64(minYears));
        ebool result = FHE.and(FHE.ge(age, threshold), _validations[user]);
        FHE.allowTransient(result, msg.sender);
        return result;
    }

    function isAgeBetween(address user, uint8 minY, uint8 maxY) external onlyVerifier returns (ebool) {
        require(minY <= maxY, "Invalid range");
        euint64 age = _computeAge(user);
        euint64 minSec = FHE.mul(FHE.asEuint64(365 days), FHE.asEuint64(minY));
        euint64 maxSec = FHE.mul(FHE.asEuint64(365 days), FHE.asEuint64(maxY));
        ebool inRange = FHE.and(FHE.ge(age, minSec), FHE.le(age, maxSec));
        ebool result = FHE.and(_validations[user], inRange);
        FHE.allowTransient(result, msg.sender);
        return result;
    }

    function hasGender(address user, uint8 genderValue) public onlyVerifier returns (ebool) {
        ebool matchGender = FHE.eq(_genders[user], FHE.asEuint8(genderValue));
        ebool result = FHE.and(_validations[user], matchGender);
        FHE.allowTransient(result, msg.sender);
        return result;
    }

    function isMale(address user) external onlyVerifier returns (ebool) {
        return hasGender(user, 1);
    }

    function isFemale(address user) external onlyVerifier returns (ebool) {
        return hasGender(user, 2);
    }

    // Contoh fungsi untuk memeriksa apakah sebuah alamat adalah kontrak
    function isContract(address _addr) public view returns (bool) {
        uint256 size;
        // Menggunakan assembly untuk memanggil opkode EXTCODESIZE
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }
}
