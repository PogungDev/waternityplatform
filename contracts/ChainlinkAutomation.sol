// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingVault.sol";

/**
 * @title ChainlinkAutomation
 * @dev Automated yield distribution using Chainlink Automation
 * This contract automatically updates yield rates for wells based on predefined intervals
 */
contract ChainlinkAutomation is AutomationCompatibleInterface, Ownable {
    StakingVault public stakingVault;
    uint256 public interval = 1 hours; // Automation interval
    uint256 public lastTimeStamp;
    uint256[] public activeWells;
    uint256 public upkeepCounter;

    event UpkeepPerformed(uint256 indexed timestamp, uint256 wellsProcessed);
    event WellAddedToAutomation(uint256 indexed tokenId);
    event YieldRateUpdated(uint256 indexed tokenId, uint256 newRate);

    constructor(address _stakingVault) Ownable(msg.sender) {
        stakingVault = StakingVault(_stakingVault);
        lastTimeStamp = block.timestamp;
    }

    /**
     * @dev Chainlink Automation checkUpkeep function
     */
    function checkUpkeep(bytes calldata) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        performData = abi.encode(activeWells.length);
        return (upkeepNeeded, performData);
    }

    /**
     * @dev Chainlink Automation performUpkeep function
     * This function makes state changes on the blockchain using Chainlink
     */
    function performUpkeep(bytes calldata performData) external override {
        require((block.timestamp - lastTimeStamp) > interval, "Upkeep not needed");
        
        lastTimeStamp = block.timestamp;
        upkeepCounter++;
        
        uint256 processedWells = 0;
        
        // Update yield rates for all active wells
        for (uint256 i = 0; i < activeWells.length; i++) {
            uint256 tokenId = activeWells[i];
            
            // Calculate dynamic yield rate (simulated market conditions)
            uint256 newYieldRate = calculateDynamicYieldRate(tokenId);
            
            // THIS IS THE STATE CHANGE USING CHAINLINK AUTOMATION
            stakingVault.updateYieldRate(tokenId, newYieldRate);
            
            emit YieldRateUpdated(tokenId, newYieldRate);
            processedWells++;
        }
        
        emit UpkeepPerformed(block.timestamp, processedWells);
    }

    /**
     * @dev Calculate dynamic yield rate based on well performance
     */
    function calculateDynamicYieldRate(uint256 tokenId) internal view returns (uint256) {
        // Dynamic calculation based on:
        // - Well age
        // - Total staked amount
        // - Market conditions (simulated)
        
        uint256 totalStaked = stakingVault.getTotalStakedPerWell(tokenId);
        uint256 baseRate = 300; // 3% base
        
        // Higher stakes get slightly lower rates (diminishing returns)
        if (totalStaked > 10000 * 10**6) { // > 10k USDC
            baseRate = 250; // 2.5%
        } else if (totalStaked > 5000 * 10**6) { // > 5k USDC
            baseRate = 280; // 2.8%
        }
        
        // Add some variability based on upkeep counter (simulating market)
        uint256 marketVariation = (upkeepCounter % 50); // 0-49 basis points
        
        return baseRate + marketVariation;
    }

    /**
     * @dev Add well to automation list
     */
    function addWellToAutomation(uint256 tokenId) external onlyOwner {
        // Check if well already exists
        for (uint256 i = 0; i < activeWells.length; i++) {
            if (activeWells[i] == tokenId) {
                return; // Already exists
            }
        }
        
        activeWells.push(tokenId);
        emit WellAddedToAutomation(tokenId);
    }

    /**
     * @dev Get all active wells
     */
    function getActiveWells() external view returns (uint256[] memory) {
        return activeWells;
    }

    /**
     * @dev Update automation interval
     */
    function setInterval(uint256 _newInterval) external onlyOwner {
        interval = _newInterval;
    }

    /**
     * @dev Update staking vault address
     */
    function setStakingVault(address _newVault) external onlyOwner {
        stakingVault = StakingVault(_newVault);
    }
} 