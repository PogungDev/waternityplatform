// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingVault.sol";

/**
 * @title ChainlinkDataFeeds
 * @dev Uses Chainlink Data Feeds to get external market data for yield calculations
 * This contract demonstrates state changes based on real-world data from Chainlink oracles
 */
contract ChainlinkDataFeeds is Ownable {
    AggregatorV3Interface internal priceFeed;
    StakingVault public stakingVault;
    
    // Price thresholds for yield adjustments
    int256 public constant HIGH_PRICE_THRESHOLD = 2000 * 10**8; // $2000 (assuming 8 decimals)
    int256 public constant LOW_PRICE_THRESHOLD = 1500 * 10**8;  // $1500
    
    uint256 public constant HIGH_YIELD_RATE = 400; // 4% when prices are high
    uint256 public constant NORMAL_YIELD_RATE = 300; // 3% normal rate
    uint256 public constant LOW_YIELD_RATE = 200; // 2% when prices are low
    
    uint256 public lastUpdateTimestamp;
    int256 public lastPrice;
    
    event YieldRateAdjusted(uint256 indexed tokenId, uint256 newRate, int256 triggerPrice);
    event PriceUpdated(int256 newPrice, uint256 timestamp);

    /**
     * @dev Initialize with ETH/USD price feed
     * Sepolia testnet: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     * Mainnet: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
     */
    constructor(address _priceFeed, address _stakingVault) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        stakingVault = StakingVault(_stakingVault);
        lastUpdateTimestamp = block.timestamp;
    }

    /**
     * @dev Get latest price from Chainlink Data Feed
     */
    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        require(timeStamp > 0, "Round not complete");
        return price;
    }

    /**
     * @dev Update yield rates based on Chainlink price data
     * This function makes STATE CHANGES based on Chainlink Data Feeds
     */
    function updateYieldBasedOnMarket(uint256[] memory tokenIds) external {
        require(tokenIds.length > 0, "No tokens provided");
        
        // Get latest price from Chainlink
        int256 currentPrice = getLatestPrice();
        lastPrice = currentPrice;
        lastUpdateTimestamp = block.timestamp;
        
        emit PriceUpdated(currentPrice, block.timestamp);
        
        // Determine new yield rate based on market conditions
        uint256 newYieldRate;
        if (currentPrice >= HIGH_PRICE_THRESHOLD) {
            newYieldRate = HIGH_YIELD_RATE; // Bull market - higher yields
        } else if (currentPrice <= LOW_PRICE_THRESHOLD) {
            newYieldRate = LOW_YIELD_RATE; // Bear market - lower yields
        } else {
            newYieldRate = NORMAL_YIELD_RATE; // Normal market
        }
        
        // Apply new yield rate to all specified wells
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            // THIS IS THE STATE CHANGE USING CHAINLINK DATA FEEDS
            stakingVault.updateYieldRate(tokenId, newYieldRate);
            
            emit YieldRateAdjusted(tokenId, newYieldRate, currentPrice);
        }
    }

    /**
     * @dev Batch update all wells with market-based yield
     */
    function updateAllWellsYield() external {
        // Get current price
        int256 currentPrice = getLatestPrice();
        lastPrice = currentPrice;
        lastUpdateTimestamp = block.timestamp;
        
        emit PriceUpdated(currentPrice, block.timestamp);
        
        // Calculate yield rate based on price
        uint256 newYieldRate = calculateYieldFromPrice(currentPrice);
        
        // Update multiple wells (simulating active wells)
        // In production, this would get actual active wells from registry
        for (uint256 tokenId = 0; tokenId < 5; tokenId++) {
            try stakingVault.updateYieldRate(tokenId, newYieldRate) {
                emit YieldRateAdjusted(tokenId, newYieldRate, currentPrice);
            } catch {
                // Well might not exist, continue
            }
        }
    }

    /**
     * @dev Calculate yield rate based on market price
     */
    function calculateYieldFromPrice(int256 price) public pure returns (uint256) {
        if (price >= HIGH_PRICE_THRESHOLD) {
            return HIGH_YIELD_RATE;
        } else if (price <= LOW_PRICE_THRESHOLD) {
            return LOW_YIELD_RATE;
        } else {
            return NORMAL_YIELD_RATE;
        }
    }

    /**
     * @dev Get current market-based yield rate
     */
    function getCurrentYieldRate() external view returns (uint256) {
        int256 currentPrice = getLatestPrice();
        return calculateYieldFromPrice(currentPrice);
    }

    /**
     * @dev Update price feed address
     */
    function setPriceFeed(address _newPriceFeed) external onlyOwner {
        priceFeed = AggregatorV3Interface(_newPriceFeed);
    }

    /**
     * @dev Update staking vault address
     */
    function setStakingVault(address _newVault) external onlyOwner {
        stakingVault = StakingVault(_newVault);
    }

    /**
     * @dev Get price feed info
     */
    function getPriceFeedInfo() external view returns (
        address feedAddress,
        int256 latestPrice,
        uint256 lastUpdate,
        uint8 decimals
    ) {
        return (
            address(priceFeed),
            lastPrice,
            lastUpdateTimestamp,
            priceFeed.decimals()
        );
    }
} 