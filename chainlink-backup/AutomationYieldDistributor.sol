// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingVault.sol"; // Untuk interaksi dengan vault staking

// AutomationYieldDistributor adalah kontrak yang dirancang untuk dipanggil
// oleh Chainlink Automation untuk secara otomatis mendistribusikan yield.
contract AutomationYieldDistributor is AutomationCompatibleInterface, Ownable {
    StakingVault public stakingVault; // Alamat kontrak StakingVault
    uint256 public interval; // Interval waktu (dalam detik) untuk menjalankan upkeep
    uint256 public lastTimeStamp; // Waktu terakhir upkeep dijalankan
    uint256[] public activeWells; // Daftar tokenId sumur yang aktif untuk distribusi yield

    // Event untuk melacak distribusi yield.
    event YieldDistributionTriggered(uint256 indexed timestamp, uint256 numWellsProcessed);
    event WellAddedToAutomation(uint256 indexed tokenId);

    // Constructor: Inisialisasi StakingVault dan interval.
    constructor(address _stakingVault, uint256 _interval) Ownable(msg.sender) {
        stakingVault = StakingVault(_stakingVault);
        interval = _interval;
        lastTimeStamp = block.timestamp;
    }

    // checkUpkeep: Fungsi yang dipanggil oleh Chainlink Automation untuk memeriksa
    // apakah upkeep diperlukan.
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // performData bisa digunakan untuk mengirim data ke performUpkeep,
        // misalnya daftar sumur yang perlu diproses. Untuk demo, kita kosongkan.
        performData = "";
        return (upkeepNeeded, performData);
    }

    // performUpkeep: Fungsi yang dipanggil oleh Chainlink Automation jika checkUpkeep
    // mengembalikan true. Ini akan memicu distribusi yield.
    function performUpkeep(bytes calldata /* performData */) external override {
        // Pastikan upkeep memang diperlukan untuk mencegah panggilan berulang.
        require((block.timestamp - lastTimeStamp) > interval, "AutomationYieldDistributor: Upkeep not needed");
        lastTimeStamp = block.timestamp; // Perbarui waktu terakhir upkeep.

        uint256 processedWells = 0;
        // Iterasi melalui semua sumur aktif dan perbarui yield rate atau picu klaim.
        // Dalam skenario nyata, ini akan memicu perhitungan yield terbaru di StakingVault
        // atau memperbarui parameter yang memengaruhi yield.
        // Pengguna kemudian akan mengklaim reward mereka secara manual.
        for (uint256 i = 0; i < activeWells.length; i++) {
            uint256 tokenId = activeWells[i];
            
            // Simulasi pembaruan yield rate berdasarkan performa sumur.
            // Di produksi, ini bisa menggunakan data dari Chainlink Functions.
            uint256 newYieldRate = calculateSimulatedYieldRate(tokenId);
            stakingVault.updateYieldRate(tokenId, newYieldRate);
            processedWells++;
        }
        emit YieldDistributionTriggered(block.timestamp, processedWells);
    }

    // Fungsi internal untuk mensimulasikan perhitungan yield rate.
    function calculateSimulatedYieldRate(uint256 tokenId) internal pure returns (uint256) {
        // Contoh simulasi: yield rate antara 2% (200 bp) dan 4% (400 bp).
        // Ini bisa lebih kompleks dengan data dari Chainlink Functions.
        return 200 + (tokenId % 200); // Variasi sederhana berdasarkan tokenId
    }

    // Fungsi untuk menambahkan sumur ke daftar sumur aktif yang akan diproses oleh Automation.
    // Hanya pemilik kontrak yang bisa memanggil ini.
    function addWellToAutomation(uint256 tokenId) external onlyOwner {
        // Hindari duplikasi
        bool found = false;
        for (uint256 i = 0; i < activeWells.length; i++) {
            if (activeWells[i] == tokenId) {
                found = true;
                break;
            }
        }
        if (!found) {
            activeWells.push(tokenId);
            emit WellAddedToAutomation(tokenId);
        }
    }

    // Fungsi untuk memperbarui alamat StakingVault. Hanya pemilik yang bisa memanggil.
    function setStakingVaultAddress(address _newAddress) external onlyOwner {
        stakingVault = StakingVault(_newAddress);
    }

    // Fungsi untuk memperbarui interval Automation. Hanya pemilik yang bisa memanggil.
    function setInterval(uint256 _newInterval) external onlyOwner {
        interval = _newInterval;
    }
}
