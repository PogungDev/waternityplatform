// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./StakingVault.sol";

contract WaternityVRF is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    StakingVault public stakingVault;

    uint64 s_subscriptionId;
    bytes32 keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c; // Sepolia key hash
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    mapping(uint256 => uint256) public s_requestIdToTokenId;
    mapping(uint256 => uint256) public s_randomWords;

    event RandomnessRequested(uint256 indexed requestId, uint256 indexed tokenId);
    event DisasterSimulated(uint256 indexed tokenId, uint256 impactLevel);

    constructor(uint64 subscriptionId, address _stakingVault) VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625) {
        COORDINATOR = VRFCoordinatorV2Interface(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625);
        s_subscriptionId = subscriptionId;
        stakingVault = StakingVault(_stakingVault);
    }

    function simulateDisaster(uint256 tokenId) external returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        
        s_requestIdToTokenId[requestId] = tokenId;
        emit RandomnessRequested(requestId, tokenId);
        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 tokenId = s_requestIdToTokenId[requestId];
        uint256 randomValue = randomWords[0];
        
        s_randomWords[tokenId] = randomValue;
        
        // Simulate disaster impact (0-100)
        uint256 impactLevel = randomValue % 100;
        
        if (impactLevel > 80) {
            // Severe disaster - reduce yield by 50%
            uint256 currentRate = 300; // Default rate
            uint256 newRate = currentRate / 2;
            stakingVault.updateYieldRate(tokenId, newRate);
        } else if (impactLevel > 60) {
            // Moderate disaster - reduce yield by 25%
            uint256 currentRate = 300;
            uint256 newRate = (currentRate * 75) / 100;
            stakingVault.updateYieldRate(tokenId, newRate);
        }
        // If impactLevel <= 60, no disaster occurs
        
        emit DisasterSimulated(tokenId, impactLevel);
    }

    function getRandomValue(uint256 tokenId) external view returns (uint256) {
        return s_randomWords[tokenId];
    }
}
