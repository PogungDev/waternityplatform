// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./WaterNFT.sol";

contract WellRegistry {
    WaterNFT public waterNFT;
    
    struct WellInfo {
        uint256 tokenId;
        string location;
        uint256 capacity;
        uint256 peopleServed;
        bool isActive;
        address fieldPartner;
        uint256 totalStaked;
        uint256 impactScore;
    }

    mapping(uint256 => WellInfo) public wellRegistry;
    mapping(string => bool) public locationExists;
    uint256[] public activeWells;

    event WellRegistered(uint256 indexed tokenId, string location, uint256 capacity);
    event WellUpdated(uint256 indexed tokenId, uint256 newCapacity, uint256 newPeopleServed);

    constructor(address _waterNFT) {
        waterNFT = WaterNFT(_waterNFT);
    }

    function registerWell(uint256 tokenId) external {
        require(waterNFT.ownerOf(tokenId) != address(0), "NFT does not exist");
        
        WaterNFT.WellData memory wellData = waterNFT.getWellData(tokenId);
        require(!locationExists[wellData.location], "Location already registered");

        wellRegistry[tokenId] = WellInfo({
            tokenId: tokenId,
            location: wellData.location,
            capacity: wellData.capacity,
            peopleServed: wellData.peopleServed,
            isActive: wellData.isActive,
            fieldPartner: wellData.fieldPartner,
            totalStaked: 0,
            impactScore: calculateImpactScore(wellData.capacity, wellData.peopleServed)
        });

        locationExists[wellData.location] = true;
        activeWells.push(tokenId);

        emit WellRegistered(tokenId, wellData.location, wellData.capacity);
    }

    function updateWellData(uint256 tokenId, uint256 newCapacity, uint256 newPeopleServed) external {
        require(wellRegistry[tokenId].fieldPartner == msg.sender, "Not authorized");
        
        wellRegistry[tokenId].capacity = newCapacity;
        wellRegistry[tokenId].peopleServed = newPeopleServed;
        wellRegistry[tokenId].impactScore = calculateImpactScore(newCapacity, newPeopleServed);

        emit WellUpdated(tokenId, newCapacity, newPeopleServed);
    }

    function calculateImpactScore(uint256 capacity, uint256 peopleServed) public pure returns (uint256) {
        // Simple impact score: (people_served * capacity) / 1000
        return (peopleServed * capacity) / 1000;
    }

    function getActiveWells() external view returns (uint256[] memory) {
        return activeWells;
    }

    function getWellInfo(uint256 tokenId) external view returns (WellInfo memory) {
        return wellRegistry[tokenId];
    }

    function updateTotalStaked(uint256 tokenId, uint256 amount) external {
        // This should be called by StakingVault contract
        wellRegistry[tokenId].totalStaked += amount;
    }
}
