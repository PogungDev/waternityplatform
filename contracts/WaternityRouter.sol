// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./WaterNFT.sol";
import "./WellRegistry.sol";
import "./StakingVault.sol";
import "./ChainlinkAutomation.sol";
import "./ChainlinkDataFeeds.sol";
import "./ChainlinkFunctions.sol";

/**
 * @title WaternityRouter
 * @dev Main router contract integrating all Chainlink services with Waternity Platform
 * This contract demonstrates comprehensive Chainlink integration for the hackathon
 */
contract WaternityRouter is Ownable {
    WaterNFT public waterNFT;
    WellRegistry public wellRegistry;
    StakingVault public stakingVault;
    ChainlinkAutomation public chainlinkAutomation;
    ChainlinkDataFeeds public chainlinkDataFeeds;
    ChainlinkFunctions public chainlinkFunctions;

    event ContractsInitialized();
    event ChainlinkServicesIntegrated();

    constructor(
        address _waterNFT,
        address _wellRegistry,
        address _stakingVault,
        address _chainlinkAutomation,
        address _chainlinkDataFeeds,
        address _chainlinkFunctions
    ) Ownable(msg.sender) {
        waterNFT = WaterNFT(_waterNFT);
        wellRegistry = WellRegistry(_wellRegistry);
        stakingVault = StakingVault(_stakingVault);
        chainlinkAutomation = ChainlinkAutomation(_chainlinkAutomation);
        chainlinkDataFeeds = ChainlinkDataFeeds(_chainlinkDataFeeds);
        chainlinkFunctions = ChainlinkFunctions(_chainlinkFunctions);

        emit ContractsInitialized();
        emit ChainlinkServicesIntegrated();
    }

    // =================
    // CORE FUNCTIONALITY WITH CHAINLINK INTEGRATION
    // =================

    /**
     * @dev Mint a new well NFT with automatic registration and setup
     */
    function mintWell(
        address to,
        string memory location,
        uint256 capacity,
        uint256 peopleServed,
        string memory metadataURI
    ) external returns (uint256 tokenId) {
        // Mint the NFT
        tokenId = waterNFT.mintWell(to, location, capacity, peopleServed, metadataURI);
        
        // Automatically register the well
        try wellRegistry.registerWell(tokenId) {} catch {}
        
        // Add to Chainlink Automation for yield updates
        try chainlinkAutomation.addWellToAutomation(tokenId) {} catch {}
        
        return tokenId;
    }

    /**
     * @dev Burn a well NFT with proper cleanup
     */
    function burnWell(uint256 tokenId, string memory reason) external {
        // Check if well has any staked funds
        uint256 totalStaked = stakingVault.getTotalStakedPerWell(tokenId);
        require(totalStaked == 0, "WaternityRouter: Cannot burn well with active stakes");
        
        // Burn the NFT (will check permissions internally)
        waterNFT.burnWell(tokenId, reason);
        
        // Clean up automation (if it was added)
        // Note: In production, we'd need a remove function in automation contract
    }

    /**
     * @dev Emergency burn with admin privileges
     */
    function emergencyBurnWell(uint256 tokenId, string memory reason) external {
        // Only router owner can emergency burn
        require(msg.sender == owner(), "WaternityRouter: Only owner can emergency burn");
        
        waterNFT.emergencyBurn(tokenId, reason);
    }

    /**
     * @dev Stake and automatically add well to Chainlink Automation
     */
    function stakeAndEnableAutomation(uint256 tokenId, uint256 amount) external {
        // Register well if not already registered
        try wellRegistry.registerWell(tokenId) {} catch {}
        
        // Stake in vault
        stakingVault.stake(tokenId, amount);
        
        // Add to Chainlink Automation for automatic yield updates
        try chainlinkAutomation.addWellToAutomation(tokenId) {} catch {}
    }

    /**
     * @dev Update well yields using Chainlink Data Feeds (market-based pricing)
     */
    function updateYieldsWithMarketData(uint256[] memory tokenIds) external {
        chainlinkDataFeeds.updateYieldBasedOnMarket(tokenIds);
    }

    /**
     * @dev Verify well data using Chainlink Functions
     */
    function verifyWellWithExternalData(
        uint256 tokenId,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external returns (bytes32 requestId) {
        return chainlinkFunctions.requestWellData(tokenId, subscriptionId, gasLimit, donID);
    }

    /**
     * @dev Get comprehensive well details including Chainlink data
     */
    function getWellDetailsWithChainlink(uint256 tokenId) external view returns (
        WaterNFT.WellData memory wellData,
        WellRegistry.WellInfo memory registryInfo,
        uint256 pendingRewards,
        uint256 currentYieldRate,
        int256 marketPrice,
        bool automationEnabled
    ) {
        wellData = waterNFT.getWellData(tokenId);
        registryInfo = wellRegistry.getWellInfo(tokenId);
        pendingRewards = stakingVault.getPendingRewards(msg.sender, tokenId);
        currentYieldRate = chainlinkDataFeeds.getCurrentYieldRate();
        marketPrice = chainlinkDataFeeds.getLatestPrice();
        
        // Check if well is in automation
        uint256[] memory activeWells = chainlinkAutomation.getActiveWells();
        automationEnabled = false;
        for (uint256 i = 0; i < activeWells.length; i++) {
            if (activeWells[i] == tokenId) {
                automationEnabled = true;
                break;
            }
        }
    }

    // =================
    // CHAINLINK AUTOMATION CONTROLS
    // =================

    /**
     * @dev Add multiple wells to Chainlink Automation
     */
    function batchEnableAutomation(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            try chainlinkAutomation.addWellToAutomation(tokenIds[i]) {} catch {}
        }
    }

    /**
     * @dev Get Chainlink Automation status
     */
    function getAutomationStatus() external view returns (
        uint256[] memory activeWells,
        uint256 interval,
        uint256 lastUpkeep,
        uint256 upkeepCounter
    ) {
        activeWells = chainlinkAutomation.getActiveWells();
        interval = chainlinkAutomation.interval();
        lastUpkeep = chainlinkAutomation.lastTimeStamp();
        upkeepCounter = chainlinkAutomation.upkeepCounter();
    }

    // =================
    // CHAINLINK DATA FEEDS INTEGRATION
    // =================

    /**
     * @dev Get market data from Chainlink
     */
    function getMarketData() external view returns (
        int256 currentPrice,
        uint256 suggestedYieldRate,
        uint256 lastUpdate
    ) {
        currentPrice = chainlinkDataFeeds.getLatestPrice();
        suggestedYieldRate = chainlinkDataFeeds.getCurrentYieldRate();
        (,, lastUpdate,) = chainlinkDataFeeds.getPriceFeedInfo();
    }

    /**
     * @dev Update all wells with current market conditions
     */
    function updateAllWellsWithMarket() external {
        chainlinkDataFeeds.updateAllWellsYield();
    }

    // =================
    // CHAINLINK FUNCTIONS INTEGRATION
    // =================

    /**
     * @dev Batch verify multiple wells using Chainlink Functions
     */
    function batchVerifyWells(
        uint256[] memory tokenIds,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external {
        chainlinkFunctions.batchRequestWellData(tokenIds, subscriptionId, gasLimit, donID);
    }

    /**
     * @dev Get Chainlink Functions status for a well
     */
    function getFunctionsStatus(uint256 tokenId) external view returns (
        bool verificationInProgress,
        bytes memory lastResponse,
        bytes memory lastError
    ) {
        verificationInProgress = chainlinkFunctions.verificationInProgress(tokenId);
        lastResponse = chainlinkFunctions.s_lastResponse();
        lastError = chainlinkFunctions.s_lastError();
    }

    // =================
    // COMPREHENSIVE PLATFORM ACTIONS
    // =================

    /**
     * @dev Complete well onboarding with full Chainlink integration
     */
    function onboardWellWithChainlink(
        uint256 tokenId,
        uint256 stakeAmount,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external returns (bytes32 functionsRequestId) {
        // 1. Register well
        try wellRegistry.registerWell(tokenId) {} catch {}
        
        // 2. Stake funds
        stakingVault.stake(tokenId, stakeAmount);
        
        // 3. Enable Chainlink Automation
        try chainlinkAutomation.addWellToAutomation(tokenId) {} catch {}
        
        // 4. Verify with Chainlink Functions
        functionsRequestId = chainlinkFunctions.requestWellData(tokenId, subscriptionId, gasLimit, donID);
        
        // 5. Update yield with market data
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tokenId;
        try chainlinkDataFeeds.updateYieldBasedOnMarket(tokenIds) {} catch {}
        
        return functionsRequestId;
    }

    /**
     * @dev Get all Chainlink contract addresses
     */
    function getChainlinkContracts() external view returns (
        address automation,
        address dataFeeds,
        address functions,
        address stakingVault,
        address wellRegistry,
        address waterNFT
    ) {
        return (
            address(chainlinkAutomation),
            address(chainlinkDataFeeds),
            address(chainlinkFunctions),
            address(stakingVault),
            address(wellRegistry),
            address(waterNFT)
        );
    }

    /**
     * @dev Emergency function to demonstrate Chainlink state changes
     */
    function demonstrateChainlinkIntegration(uint256 tokenId) external {
        // This function shows how Chainlink services make state changes
        
        // 1. Add to automation (state change)
        try chainlinkAutomation.addWellToAutomation(tokenId) {} catch {}
        
        // 2. Update yield with market data (state change)
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = tokenId;
        try chainlinkDataFeeds.updateYieldBasedOnMarket(tokenIds) {} catch {}
        
        // 3. Manual well data update for demo (state change)
        try chainlinkFunctions.manuallyUpdateWellData(tokenId, true, 1200, 75) {} catch {}
    }
} 