// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WaterNFT.sol";
import "./WellRegistry.sol";
import "./StakingVault.sol";

contract WaternityRouter {
    WaterNFT public waterNFT;
    WellRegistry public wellRegistry;
    StakingVault public stakingVault;

    event ContractsInitialized();

    constructor(
        address _waterNFT,
        address _wellRegistry,
        address _stakingVault,
        address, // dummy for functionsContract
        address, // dummy for automationContract
        address  // dummy for vrfContract
    ) {
        waterNFT = WaterNFT(_waterNFT);
        wellRegistry = WellRegistry(_wellRegistry);
        stakingVault = StakingVault(_stakingVault);

        emit ContractsInitialized();
    }

    // Convenience functions for frontend
    function getWellDetails(uint256 tokenId) external view returns (
        WaterNFT.WellData memory wellData,
        WellRegistry.WellInfo memory registryInfo,
        uint256 pendingRewards
    ) {
        wellData = waterNFT.getWellData(tokenId);
        registryInfo = wellRegistry.getWellInfo(tokenId);
        pendingRewards = stakingVault.getPendingRewards(msg.sender, tokenId);
    }

    function stakeAndRegister(uint256 tokenId, uint256 amount) external {
        // Register well if not already registered
        try wellRegistry.registerWell(tokenId) {} catch {}
        
        // Stake
        stakingVault.stake(tokenId, amount);
    }
} 