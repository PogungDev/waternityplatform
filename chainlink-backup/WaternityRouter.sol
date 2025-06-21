// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./WaterNFT.sol";
import "./WellRegistry.sol";
import "./StakingVault.sol";
import "./ChainlinkFunctions.sol";
import "./ChainlinkAutomation.sol";
import "./ChainlinkVRF.sol";

contract WaternityRouter {
    WaterNFT public waterNFT;
    WellRegistry public wellRegistry;
    StakingVault public stakingVault;
    WaternityFunctions public functionsContract;
    WaternityAutomation public automationContract;
    WaternityVRF public vrfContract;

    event ContractsInitialized();

    constructor(
        address _waterNFT,
        address _wellRegistry,
        address _stakingVault,
        address _functions,
        address _automation,
        address _vrf
    ) {
        waterNFT = WaterNFT(_waterNFT);
        wellRegistry = WellRegistry(_wellRegistry);
        stakingVault = StakingVault(_stakingVault);
        functionsContract = WaternityFunctions(_functions);
        automationContract = WaternityAutomation(_automation);
        vrfContract = WaternityVRF(_vrf);

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
        
        // Add to automation
        automationContract.addWell(tokenId);
        
        // Stake
        stakingVault.stake(tokenId, amount);
    }

    function requestForecast(uint256 tokenId, string calldata source, string[] calldata args) external {
        functionsContract.sendRequest(
            1, // subscription ID
            args,
            "", // no encrypted secrets
            0, // no hosted secrets
            0, // no hosted secrets version
            source,
            tokenId
        );
    }

    function simulateRandomEvent(uint256 tokenId) external {
        vrfContract.simulateDisaster(tokenId);
    }
}
