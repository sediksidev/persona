// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IPersona} from "./IPersona.sol";

/// @title PersonaMock
/// @notice Mock contract untuk testing berbagai fungsi verifikasi di Persona
///         Menyediakan berbagai test cases untuk validasi integrasi
contract PersonaMock is ZamaEthereumConfig {
    IPersona public persona;

    // Storage untuk berbagai test cases
    mapping(address => euint32) private _counters;
    mapping(address => euint8) private _voteCount;
    mapping(address => euint8) private _viewCount;
    mapping(address => euint8) private _claimCount;

    constructor(address personaAddr) {
        persona = IPersona(personaAddr);
    }

    // ============================================
    // TEST 1: Conditional Increment (Adult Only)
    // ============================================
    function conditionalIncrement() external {
        address user = msg.sender;
        ebool isAdult = persona.isAgeAtLeast(user, 18);
        euint32 counter = _counters[user];

        if (!FHE.isInitialized(counter)) {
            counter = FHE.asEuint32(0);
            FHE.allow(counter, user);
            FHE.allow(counter, address(this));
        }

        euint32 newCounter = FHE.add(counter, FHE.asEuint32(1));
        euint32 result = FHE.select(isAdult, newCounter, counter);

        _counters[user] = result;

        FHE.allow(result, user);
        FHE.allow(result, address(this));
    }

    /// @notice Ambil nilai counter untuk user tertentu
    function getCounter(address user) external view returns (euint32) {
        return _counters[user];
    }

    // ============================================
    // TEST 2: Vote (Usia > 18 tahun)
    // ============================================
    /// @notice Vote hanya bisa dilakukan jika usia > 18 tahun
    function vote() external {
        address user = msg.sender;
        ebool canVote = persona.isAgeAtLeast(user, 19); // > 18 berarti >= 19
        euint8 voteCount = _voteCount[user];

        if (!FHE.isInitialized(voteCount)) {
            voteCount = FHE.asEuint8(0);
            FHE.allow(voteCount, user);
            FHE.allow(voteCount, address(this));
        }

        euint8 newVoteCount = FHE.add(voteCount, FHE.asEuint8(1));
        euint8 result = FHE.select(canVote, newVoteCount, voteCount);

        _voteCount[user] = result;

        FHE.allow(result, user);
        FHE.allow(result, address(this));
    }

    /// @notice Ambil jumlah vote untuk user tertentu
    function getVoteCount(address user) external view returns (euint8) {
        return _voteCount[user];
    }

    // ============================================
    // TEST 3: View (Hanya Perempuan)
    // ============================================
    /// @notice View hanya bisa dilakukan oleh perempuan
    function viewContent() external {
        address user = msg.sender;
        ebool isFemale = persona.isFemale(user);
        euint8 viewCount = _viewCount[user];

        if (!FHE.isInitialized(viewCount)) {
            viewCount = FHE.asEuint8(0);
            FHE.allow(viewCount, user);
            FHE.allow(viewCount, address(this));
        }

        euint8 newViewCount = FHE.add(viewCount, FHE.asEuint8(1));
        euint8 result = FHE.select(isFemale, newViewCount, viewCount);

        _viewCount[user] = result;

        FHE.allow(result, user);
        FHE.allow(result, address(this));
    }

    /// @notice Ambil jumlah view untuk user tertentu
    function getViewCount(address user) external view returns (euint8) {
        return _viewCount[user];
    }

    // ============================================
    // TEST 4: Claim (Laki-laki di bawah 30 tahun)
    // ============================================
    /// @notice Claim hanya bisa dilakukan oleh laki-laki berusia < 30 tahun
    function claimReward() external {
        address user = msg.sender;
        ebool isMale = persona.isMale(user);
        ebool isBelow30 = persona.isAgeBetween(user, 0, 29);

        // Gabungkan kedua kondisi: isMale AND isBelow30
        ebool canClaim = FHE.and(isMale, isBelow30);

        euint8 claimCount = _claimCount[user];

        if (!FHE.isInitialized(claimCount)) {
            claimCount = FHE.asEuint8(0);
            FHE.allow(claimCount, user);
            FHE.allow(claimCount, address(this));
        }

        euint8 newClaimCount = FHE.add(claimCount, FHE.asEuint8(1));
        euint8 result = FHE.select(canClaim, newClaimCount, claimCount);

        _claimCount[user] = result;

        FHE.allow(result, user);
        FHE.allow(result, address(this));
    }

    /// @notice Ambil jumlah claim untuk user tertentu
    function getClaimCount(address user) external view returns (euint8) {
        return _claimCount[user];
    }
}
