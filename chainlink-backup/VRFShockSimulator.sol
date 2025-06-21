// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingVault.sol"; // Untuk memperbarui yield rate

// VRFShockSimulator menggunakan Chainlink VRF untuk mensimulasikan
// event bencana acak yang dapat memengaruhi yield sumur.
contract VRFShockSimulator is VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface COORDINATOR; // Interface ke VRF Coordinator
    StakingVault public stakingVault; // Alamat kontrak StakingVault

    // Parameter konfigurasi Chainlink VRF.
    bytes32 public keyHash; // Key hash untuk VRF
    uint64 public s_subscriptionId; // ID langganan VRF
    uint32 public callbackGasLimit; // Batas gas untuk fungsi callback
    uint16 public requestConfirmations; // Jumlah konfirmasi blok yang dibutuhkan
    uint32 public numWords; // Jumlah angka acak yang diminta

    // Mapping untuk melacak requestId ke tokenId sumur.
    mapping(uint256 => uint256) public s_requestIdToTokenId;
    // Mapping untuk menyimpan angka acak yang dihasilkan per tokenId.
    mapping(uint256 => uint256) public s_randomWords;
    // Mapping untuk melacak apakah sumur sedang dalam kondisi shock.
    mapping(uint256 => bool) public wellShocked;

    // Events untuk melacak permintaan dan simulasi bencana.
    event RandomnessRequested(uint256 indexed requestId, uint256 indexed tokenId);
    event DisasterSimulated(uint256 indexed tokenId, uint256 impactLevel, uint256 newYieldRate);

    // Constructor: Inisialisasi VRF Coordinator, ID langganan, dan StakingVault.
    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        bytes32 _keyHash,
        uint32 _callbackGasLimit,
        uint16 _requestConfirmations,
        uint32 _numWords,
        address _stakingVault
    ) VRFConsumerBaseV2(vrfCoordinator) Ownable(msg.sender) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
        callbackGasLimit = _callbackGasLimit;
        requestConfirmations = _requestConfirmations;
        numWords = _numWords;
        stakingVault = StakingVault(_stakingVault);
    }

    // Fungsi untuk memicu simulasi event bencana untuk sumur tertentu.
    // Hanya pemilik kontrak atau Eliza agent (melalui ElizaTriggerRouter) yang bisa memanggil ini.
    function simulateShockEvent(uint256 tokenId) external onlyOwner returns (uint256 requestId) {
        // Meminta angka acak dari Chainlink VRF.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        
        s_requestIdToTokenId[requestId] = tokenId; // Simpan tokenId yang terkait dengan requestId
        emit RandomnessRequested(requestId, tokenId);
        return requestId;
    }

    // Fungsi callback yang dipanggil oleh Chainlink VRF setelah angka acak dihasilkan.
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 tokenId = s_requestIdToTokenId[requestId];
        uint256 randomValue = randomWords[0]; // Ambil angka acak pertama
        
        s_randomWords[tokenId] = randomValue; // Simpan angka acak

        // Simulasikan tingkat dampak bencana (0-99).
        uint256 impactLevel = randomValue % 100; // Angka acak antara 0 dan 99
        
        uint256 currentRate = stakingVault.getYieldRatePerWell(tokenId);
        uint256 newRate = currentRate;
        bool isShocked = false;

        if (impactLevel > 80) { // 20% kemungkinan bencana parah
            newRate = (currentRate * 50) / 100; // Yield turun 50%
            isShocked = true;
        } else if (impactLevel > 60) { // 20% kemungkinan bencana sedang
            newRate = (currentRate * 75) / 100; // Yield turun 25%
            isShocked = true;
        }
        // Jika impactLevel <= 60, tidak ada bencana atau dampak minimal.

        // Perbarui status shock sumur.
        wellShocked[tokenId] = isShocked;

        // Perbarui yield rate di StakingVault.
        // Pastikan StakingVault.updateYieldRate memiliki akses kontrol yang sesuai (misal: hanya dari VRFShockSimulator).
        // Untuk demo, kita asumsikan onlyOwner di StakingVault, dan VRFShockSimulator adalah owner.
        // Di produksi, Anda akan menggunakan peran atau daftar putih.
        stakingVault.updateYieldRate(tokenId, newRate);
        
        emit DisasterSimulated(tokenId, impactLevel, newRate);
    }

    // Fungsi view untuk mendapatkan angka acak terakhir untuk sumur tertentu.
    function getRandomValue(uint256 tokenId) external view returns (uint256) {
        return s_randomWords[tokenId];
    }

    // Fungsi view untuk memeriksa apakah sumur sedang dalam kondisi shock.
    function getWellShockedStatus(uint256 tokenId) external view returns (bool) {
        return wellShocked[tokenId];
    }

    // Fungsi untuk memperbarui alamat StakingVault. Hanya pemilik yang bisa memanggil.
    function setStakingVaultAddress(address _newAddress) external onlyOwner {
        stakingVault = StakingVault(_newAddress);
    }
}
