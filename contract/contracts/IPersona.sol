// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {euint64, euint8, ebool, externalEuint64, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";

interface IPersona {
    // =========
    // ADMIN
    // =========

    function owner() external view returns (address);

    function transferOwnership(address newOwner) external;

    function setVerifier(address verifier, bool allowed) external;

    function isVerifier(address addr) external view returns (bool);

    // =========
    // USER DATA
    // =========

    /// @notice User menyimpan birthday & gender terenkripsi
    function store(
        externalEuint64 encryptedBirthday,
        externalEuint8 encryptedGender,
        bytes calldata attestation
    ) external;

    /// @notice Ambil data user lain (testing / debug)
    function getUserData(address user) external view returns (euint64, euint8, ebool);

    // =========
    // FUNGSI VERIFIKASI (ONLY VERIFIER DI IMPLEMENTASI)
    // =========

    /// @notice umur(user) >= minAgeYears
    function isAgeAtLeast(address user, uint8 minYears) external returns (ebool);

    /// @notice minAgeYears <= umur(user) <= maxAgeYears
    function isAgeBetween(address user, uint8 minY, uint8 maxY) external returns (ebool);

    /// @notice gender terenkripsi == genderValue
    function hasGender(address user, uint8 genderValue) external returns (ebool);

    /// @notice gender == Male (1)
    function isMale(address user) external returns (ebool);

    /// @notice gender == Female (2)
    function isFemale(address user) external returns (ebool);

    /// @notice Check if address is contract
    function isContract(address _addr) external view returns (bool);
}
