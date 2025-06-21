// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingVault.sol";
import "./VRFShockSimulator.sol";
import "./AutomationYieldDistributor.sol";
import "./WaterNFT.sol"; // Untuk fungsi freeze

// ElizaTriggerRouter adalah gerbang bagi Eliza agent (off-chain)
// untuk memicu tindakan on-chain yang relevan dengan Waternity.
contract ElizaTriggerRouter is Ownable {
    StakingVault public stakingVault;
    VRFShockSimulator public vrfShockSimulator;
    AutomationYieldDistributor public automationYieldDistributor;
    WaterNFT public waterNFT;

    // Event untuk melacak panggilan dari Eliza.
    event ElizaActionTriggered(string indexed action, uint256 indexed tokenId, address indexed caller);

    // Constructor: Inisialisasi alamat kontrak-kontrak yang akan diinteraksi.
    constructor(
        address _stakingVault,
        address _vrfShockSimulator,
        address _automationYieldDistributor,
        address _waterNFT
    ) Ownable(msg.sender) {
        stakingVault = StakingVault(_stakingVault);
        vrfShockSimulator = VRFShockSimulator(_vrfShockSimulator);
        automationYieldDistributor = AutomationYieldDistributor(_automationYieldDistributor);
        waterNFT = WaterNFT(_waterNFT);
    }

    // Fungsi yang dipanggil oleh Eliza untuk memicu distribusi yield mingguan.
    // Ini akan memanggil performUpkeep di AutomationYieldDistributor.
    function elizaDistributeWeeklyYield() external onlyOwner {
        // Memanggil performUpkeep di AutomationYieldDistributor
        // Perhatikan: performUpkeep di AutomationCompatibleInterface tidak menerima argumen bytes calldata.
        // Jika Anda ingin memicu untuk sumur tertentu, AutomationYieldDistributor perlu fungsi publik yang sesuai.
        // Untuk demo, kita asumsikan performUpkeep akan mengelola semua sumur aktif.
        automationYieldDistributor.performUpkeep(""); // Memanggil performUpkeep tanpa data
        emit ElizaActionTriggered("DistributeWeeklyYield", 0, msg.sender); // tokenId 0 jika global
    }

    // Fungsi yang dipanggil oleh Eliza untuk memicu simulasi bencana (yield shock) untuk sumur tertentu.
    function elizaTriggerShock(uint256 tokenId) external onlyOwner {
        vrfShockSimulator.simulateShockEvent(tokenId);
        emit ElizaActionTriggered("TriggerShock", tokenId, msg.sender);
    }

    // (Opsional) Fungsi yang dipanggil oleh Eliza untuk membekukan vault staking
    // jika debit air sumur mencapai 0 atau kondisi kritis lainnya.
    // Ini akan memperbarui status sumur di WaterNFT menjadi tidak aktif.
    function elizaAutoFreeze(uint256 tokenId) external onlyOwner {
        waterNFT.updateWellStatus(tokenId, false); // Set sumur menjadi tidak aktif
        // Anda mungkin juga ingin menambahkan logika untuk menghentikan yield atau memaksa unstake di StakingVault
        // Misalnya: stakingVault.freezeStaking(tokenId);
        emit ElizaActionTriggered("AutoFreeze", tokenId, msg.sender);
    }

    // Fungsi untuk memperbarui alamat kontrak yang diinteraksi. Hanya pemilik yang bisa memanggil.
    function setStakingVaultAddress(address _newAddress) external onlyOwner {
        stakingVault = StakingVault(_newAddress);
    }

    function setVRFShockSimulatorAddress(address _newAddress) external onlyOwner {
        vrfShockSimulator = VRFShockSimulator(_newAddress);
    }

    function setAutomationYieldDistributorAddress(address _newAddress) external onlyOwner {
        automationYieldDistributor = AutomationYieldDistributor(_newAddress);
    }

    function setWaterNFTAddress(address _newAddress) external onlyOwner {
        waterNFT = WaterNFT(_newAddress);
    }
}
