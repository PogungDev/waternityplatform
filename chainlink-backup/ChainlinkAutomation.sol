// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";
import "./StakingVault.sol";

contract WaternityAutomation is AutomationCompatibleInterface {
    StakingVault public stakingVault;
    uint256 public interval;
    uint256 public lastTimeStamp;
    uint256[] public activeWells;

    event YieldDistributed(uint256 indexed tokenId, uint256 newYieldRate);

    constructor(address _stakingVault, uint256 _interval) {
        stakingVault = StakingVault(_stakingVault);
        interval = _interval;
        lastTimeStamp = block.timestamp;
    }

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        return (upkeepNeeded, "");
    }

    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            
            // Update yield rates for all active wells
            for (uint256 i = 0; i < activeWells.length; i++) {
                uint256 tokenId = activeWells[i];
                
                // Simulate yield calculation based on well performance
                // In production, this would use real data from Chainlink Functions
                uint256 newYieldRate = calculateYieldRate(tokenId);
                
                stakingVault.updateYieldRate(tokenId, newYieldRate);
                emit YieldDistributed(tokenId, newYieldRate);
            }
        }
    }

    function calculateYieldRate(uint256 tokenId) internal pure returns (uint256) {
        // Simulate yield calculation (200-400 basis points = 2-4% annually)
        // In production, this would use real well performance data
        return 200 + (tokenId % 200); // Simple simulation
    }

    function addWell(uint256 tokenId) external {
        activeWells.push(tokenId);
    }

    function getActiveWells() external view returns (uint256[] memory) {
        return activeWells;
    }
}
