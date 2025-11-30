// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, euint8, ebool, externalEuint64, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Persona Contract
/// @author Erazfa
contract Persona is ZamaEthereumConfig {
    mapping(address => euint64) private _birthdays;
    mapping(address => euint8) private _genders;
    mapping(address => ebool) private _validations;

    function store(
        externalEuint64 encryptedBirthday,
        externalEuint8 encryptedGender,
        bytes calldata inputProofs
    ) external {
        euint64 _encryptedCurrentTime = FHE.asEuint64(uint64(block.timestamp));
        euint64 _encryptedBirthday = FHE.fromExternal(encryptedBirthday, inputProofs);
        euint8 _encryptedGender = FHE.fromExternal(encryptedGender, inputProofs);

        // Cek apakah tanggal lahir kurang dari waktu saat ini dan gender hanya 1, 2, atau 3
        ebool isCorrectBirthday = FHE.lt(_encryptedBirthday, _encryptedCurrentTime);
        // Cek apakah gender valid (1, 2, atau 3)
        ebool isCorrectGender = FHE.and(
            FHE.lt(_encryptedGender, FHE.asEuint8(4)),
            FHE.gt(_encryptedGender, FHE.asEuint8(0))
        );
        // Apakah format keduanya sudah valid
        ebool validFormat = FHE.and(isCorrectBirthday, isCorrectGender);

        // HANYA SIMPAN NILAI JIKA FORMAT KEDUANYA SUDAH VALID
        // jika format birthday valid, gunakan nilai tersebut. Jika tidak, gunakan nilai sentinel 0
        euint64 inputBirthday = FHE.select(validFormat, _encryptedBirthday, FHE.asEuint64(0));
        // jika format gender valid, gunakan nilai tersebut. Jika tidak, gunakan nilai sentinel 0
        euint8 inputGender = FHE.select(validFormat, _encryptedGender, FHE.asEuint8(0));

        euint64 birthday;
        euint8 gender;
        ebool validation;

        // Jika nilai validations sudah pernah diinisialisasi, berarti harus dicek dulu formatnya benar atau salah
        if (FHE.isInitialized(_validations[msg.sender])) {
            // Cek dulu apakah yang tersimpan sebelumnya sudah punya format yang valid
            // validFormat diambil dari existing validations
            ebool existingValidFormat = _validations[msg.sender];
            birthday = FHE.select(
                // jika existing validFormat true, berarti ambil nilai birthday yang tersimpan sebelumnya
                existingValidFormat,
                _birthdays[msg.sender],
                // jika existing validFormat false, berarti ambil nilai inputBirthday
                inputBirthday
            );
            gender = FHE.select(
                // jika existing validFormat true, berarti ambil nilai gender yang tersimpan sebelumnya
                existingValidFormat,
                _genders[msg.sender],
                // jika existing validFormat false, berarti ambil nilai inputGender
                inputGender
            );
            validation = FHE.select(
                // jika existing validFormat true, berarti ambil nilai validation yang tersimpan sebelumnya
                existingValidFormat,
                _validations[msg.sender],
                // jika existing validFormat false, berarti ambil nilai validFormat
                validFormat
            );
        } else {
            // jika belum pernah diinisialisasi, berarti tinggal simpan nilai input langsung
            birthday = inputBirthday;
            gender = inputGender;
            validation = validFormat;
        }
        _birthdays[msg.sender] = birthday;
        _genders[msg.sender] = gender;
        _validations[msg.sender] = validation;

        FHE.allowThis(_birthdays[msg.sender]);
        FHE.allow(_birthdays[msg.sender], msg.sender);

        FHE.allowThis(_genders[msg.sender]);
        FHE.allow(_genders[msg.sender], msg.sender);

        FHE.allowThis(_validations[msg.sender]);
        FHE.allow(_validations[msg.sender], msg.sender);
    }

    // Fungsi untuk mengambil data terenkripsi dari alamat pengirim
    function retrieve() external view returns (euint64, euint8, ebool) {
        return (_birthdays[msg.sender], _genders[msg.sender], _validations[msg.sender]);
    }

    // Fungsi untuk mengambil data terenkripsi dari alamat tertentu (hanya untuk testing)
    function getUserData(address user) external view returns (euint64, euint8, ebool) {
        return (_birthdays[user], _genders[user], _validations[user]);
    }
}
