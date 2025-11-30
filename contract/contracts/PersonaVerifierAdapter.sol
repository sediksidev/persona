// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IPersona} from "./IPersona.sol";

/// @title PersonaVerifierAdapter
/// @notice Adapter sederhana untuk memanggil fungsi verifikasi di Persona
///         dan mengembalikan hasil dalam bentuk euint8 (0/1) yang bisa
///         di-decrypt oleh caller (via FHE.allow).
contract PersonaVerifierAdapter is ZamaEthereumConfig {
    IPersona public persona;

    mapping(address => euint32) private _counters;

    constructor(address personaAddr) {
        persona = IPersona(personaAddr);
    }

    function conditionalIncrement() external {
        // Cegah mengirimkan msg.sender sebagai parameter,
        // agar tidak dianggap sebagai alamat verifier oleh Persona
        /** ALTERNATIF IMPLEMENTASI
         * conditionalIncrement(address user)
         * require(msg.sender == user, "Unauthorized");
         */
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

        FHE.allow(result, user); // 👈 agar bisa di-decrypt user
        FHE.allow(result, address(this)); // 👈 optional, untuk reuse internal
    }

    /// @notice Ambil nilai counter untuk user tertentu
    function getCounter(address user) external view returns (euint32) {
        return _counters[user];
    }
}
