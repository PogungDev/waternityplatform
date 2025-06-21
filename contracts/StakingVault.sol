// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WaterNFT.sol"; // Import WaterNFT untuk mendapatkan data sumur

// StakingVault memungkinkan investor untuk stake USDC ke NFT sumur
// dan mendapatkan yield simulatif.
contract StakingVault is ReentrancyGuard, Ownable {
    IERC20 public usdcToken; // Alamat kontrak token USDC
    WaterNFT public waterNFT; // Alamat kontrak WaterNFT

    // Struktur data untuk melacak informasi staking setiap pengguna per sumur.
    struct StakeInfo {
        uint256 amount; // Jumlah USDC yang di-stake
        uint256 timestamp; // Waktu awal staking
        uint256 lastClaimTime; // Waktu terakhir klaim reward
        uint256 pendingRewards; // Reward yang belum diklaim
    }

    // Mapping: user address => tokenId => StakeInfo
    mapping(address => mapping(uint256 => StakeInfo)) public stakes;
    // Total USDC yang di-stake per sumur.
    mapping(uint256 => uint256) public totalStakedPerWell;
    // Tingkat yield tahunan per sumur dalam basis points (misal: 300 = 3%).
    mapping(uint256 => uint256) public yieldRatePerWell;
    // Base rate untuk perhitungan yield (misal: 300 = 3% per tahun).
    uint256 public constant BASE_ANNUAL_YIELD_RATE = 300; // 3%

    // Events untuk melacak aktivitas staking.
    event Staked(address indexed user, uint256 indexed tokenId, uint256 amount);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 indexed tokenId, uint256 amount);
    event YieldRateUpdated(uint256 indexed tokenId, uint256 newRate);

    // Constructor: Inisialisasi alamat token USDC dan WaterNFT.
    constructor(address _usdcToken, address _waterNFT) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        waterNFT = WaterNFT(_waterNFT);
    }

    // Fungsi untuk stake USDC ke sumur tertentu.
    function stake(uint256 tokenId, uint256 amount) external nonReentrant {
        require(amount > 0, "StakingVault: Amount must be greater than 0");
        // Pastikan sumur ada dan aktif (opsional, bisa ditambahkan validasi dari WaterNFT)
        // require(waterNFT.wells(tokenId).isActive, "StakingVault: Well is not active");

        // Transfer USDC dari pengguna ke kontrak vault.
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "StakingVault: USDC transfer failed");

        // Update pending rewards sebelum staking baru untuk menghindari kehilangan reward.
        _updatePendingRewards(msg.sender, tokenId);

        // Perbarui informasi staking pengguna.
        stakes[msg.sender][tokenId].amount += amount;
        stakes[msg.sender][tokenId].timestamp = block.timestamp; // Reset timestamp untuk perhitungan yield baru
        if (stakes[msg.sender][tokenId].lastClaimTime == 0) {
            stakes[msg.sender][tokenId].lastClaimTime = block.timestamp;
        }
        
        // Perbarui total stake per sumur.
        totalStakedPerWell[tokenId] += amount;

        // Set default yield rate jika belum diatur.
        if (yieldRatePerWell[tokenId] == 0) {
            yieldRatePerWell[tokenId] = BASE_ANNUAL_YIELD_RATE;
        }

        emit Staked(msg.sender, tokenId, amount);
    }

    // Fungsi untuk unstake USDC dari sumur tertentu.
    function unstake(uint256 tokenId, uint256 amount) external nonReentrant {
        require(stakes[msg.sender][tokenId].amount >= amount, "StakingVault: Insufficient staked amount");

        // Klaim reward yang tertunda sebelum unstake.
        claimRewards(tokenId);

        // Perbarui informasi staking pengguna.
        stakes[msg.sender][tokenId].amount -= amount;
        // Perbarui total stake per sumur.
        totalStakedPerWell[tokenId] -= amount;

        // Transfer USDC kembali ke pengguna.
        require(usdcToken.transfer(msg.sender, amount), "StakingVault: USDC transfer failed");

        emit Unstaked(msg.sender, tokenId, amount);
    }

    // Fungsi untuk mengklaim reward yang tertunda.
    function claimRewards(uint256 tokenId) public nonReentrant {
        _updatePendingRewards(msg.sender, tokenId); // Pastikan reward terbaru dihitung

        uint256 rewards = stakes[msg.sender][tokenId].pendingRewards;
        require(rewards > 0, "StakingVault: No rewards to claim");

        // Reset pending rewards dan perbarui waktu klaim terakhir.
        stakes[msg.sender][tokenId].pendingRewards = 0;
        stakes[msg.sender][tokenId].lastClaimTime = block.timestamp;

        // Transfer reward ke pengguna.
        require(usdcToken.transfer(msg.sender, rewards), "StakingVault: Reward transfer failed");

        emit RewardsClaimed(msg.sender, tokenId, rewards);
    }

    // Fungsi internal untuk memperbarui reward yang tertunda.
    function _updatePendingRewards(address user, uint256 tokenId) internal {
        StakeInfo storage stakeInfo = stakes[user][tokenId];
        if (stakeInfo.amount == 0) return;

        uint256 timeElapsed = block.timestamp - stakeInfo.lastClaimTime;
        if (timeElapsed == 0) return; // Tidak ada waktu berlalu, tidak ada reward baru

        // Rumus yield: (amount_staked * annual_yield_rate * time_elapsed_in_seconds) / (10000 * 1 year in seconds)
        // 10000 karena yieldRate dalam basis points (100 = 1%)
        // 365 days * 24 hours * 60 minutes * 60 seconds = 31536000 seconds
        uint256 annualReward = (stakeInfo.amount * yieldRatePerWell[tokenId]) / 10000;
        uint256 reward = (annualReward * timeElapsed) / 31536000; // Reward per detik

        stakeInfo.pendingRewards += reward;
        stakeInfo.lastClaimTime = block.timestamp; // Perbarui lastClaimTime setelah perhitungan
    }

    // Fungsi untuk memperbarui tingkat yield per sumur. Hanya pemilik kontrak yang bisa memanggil ini.
    // Ini akan dipanggil oleh Chainlink Automation atau Eliza agent.
    function updateYieldRate(uint256 tokenId, uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "StakingVault: Yield rate cannot exceed 10%"); // Batasi yield rate
        yieldRatePerWell[tokenId] = newRate;
        emit YieldRateUpdated(tokenId, newRate);
    }

    // Fungsi view untuk mendapatkan informasi staking pengguna.
    function getStakeInfo(address user, uint256 tokenId) external view returns (StakeInfo memory) {
        return stakes[user][tokenId];
    }

    // Fungsi view untuk mendapatkan reward yang tertunda (termasuk yang belum di-update).
    function getPendingRewards(address user, uint256 tokenId) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user][tokenId];
        if (stakeInfo.amount == 0) return stakeInfo.pendingRewards;

        uint256 timeElapsed = block.timestamp - stakeInfo.lastClaimTime;
        uint256 annualReward = (stakeInfo.amount * yieldRatePerWell[tokenId]) / 10000;
        uint256 reward = (annualReward * timeElapsed) / 31536000;

        return stakeInfo.pendingRewards + reward;
    }

    // Fungsi view untuk mendapatkan total stake per sumur.
    function getTotalStakedPerWell(uint256 tokenId) external view returns (uint256) {
        return totalStakedPerWell[tokenId];
    }

    // Fungsi view untuk mendapatkan tingkat yield per sumur.
    function getYieldRatePerWell(uint256 tokenId) external view returns (uint256) {
        return yieldRatePerWell[tokenId];
    }
}
