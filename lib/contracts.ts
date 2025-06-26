import { ethers } from 'ethers'

// Contract ABIs (simplified - in production would import from artifacts)
export const CONTRACT_ADDRESSES = {
  WATER_NFT: process.env.NEXT_PUBLIC_WATER_NFT_ADDRESS || '',
  WELL_REGISTRY: process.env.NEXT_PUBLIC_WELL_REGISTRY_ADDRESS || '',
  STAKING_VAULT: process.env.NEXT_PUBLIC_STAKING_VAULT_ADDRESS || '',
  WATERNITY_ROUTER: process.env.NEXT_PUBLIC_WATERNITY_ROUTER_ADDRESS || '',
  CHAINLINK_AUTOMATION: process.env.NEXT_PUBLIC_CHAINLINK_AUTOMATION_ADDRESS || '',
  CHAINLINK_DATA_FEEDS: process.env.NEXT_PUBLIC_CHAINLINK_DATA_FEEDS_ADDRESS || '',
  CHAINLINK_FUNCTIONS: process.env.NEXT_PUBLIC_CHAINLINK_FUNCTIONS_ADDRESS || '',
  MOCK_TOKEN: process.env.NEXT_PUBLIC_MOCK_TOKEN_ADDRESS || '',
}

// Simplified ABI for WaternityRouter with new functions
export const WATERNITY_ROUTER_ABI = [
  // Core functions
  "function mintWell(address to, string memory location, uint256 capacity, uint256 peopleServed, string memory metadataURI) external returns (uint256)",
  "function burnWell(uint256 tokenId, string memory reason) external",
  "function emergencyBurnWell(uint256 tokenId, string memory reason) external",
  
  // Chainlink integration
  "function stakeAndEnableAutomation(uint256 tokenId, uint256 amount) external",
  "function updateYieldsWithMarketData(uint256[] memory tokenIds) external",
  "function verifyWellWithExternalData(uint256 tokenId, uint64 subscriptionId, uint32 gasLimit, bytes32 donID) external returns (bytes32)",
  "function getWellDetailsWithChainlink(uint256 tokenId) external view returns (tuple(string location, uint256 capacity, uint256 peopleServed, bool isActive, address fieldPartner, uint256 createdAt, string metadataURI), tuple(uint256 tokenId, string location, uint256 capacity, uint256 peopleServed, bool isActive, address fieldPartner, uint256 totalStaked, uint256 impactScore), uint256, uint256, int256, bool)",
  
  // Automation status
  "function getAutomationStatus() external view returns (uint256[], uint256, uint256, uint256)",
  "function getMarketData() external view returns (int256, uint256, uint256)",
  "function getFunctionsStatus(uint256 tokenId) external view returns (bool, bytes, bytes)",
  
  // Complete onboarding
  "function onboardWellWithChainlink(uint256 tokenId, uint256 stakeAmount, uint64 subscriptionId, uint32 gasLimit, bytes32 donID) external returns (bytes32)",
  "function demonstrateChainlinkIntegration(uint256 tokenId) external",
  
  // Contract addresses
  "function getChainlinkContracts() external view returns (address, address, address, address, address, address)"
]

export const WATER_NFT_ABI = [
  "function mintWell(address to, string memory location, uint256 capacity, uint256 peopleServed, string memory metadataURI) external returns (uint256)",
  "function burnWell(uint256 tokenId, string memory reason) external",
  "function emergencyBurn(uint256 tokenId, string memory reason) external",
  "function getWellData(uint256 tokenId) external view returns (tuple(string location, uint256 capacity, uint256 peopleServed, bool isActive, address fieldPartner, uint256 createdAt, string metadataURI))",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function getTotalMinted() external view returns (uint256)",
  "function wellExists(uint256 tokenId) external view returns (bool)",
  "function authorizePartner(address partner) external",
  "function authorizedPartners(address) external view returns (bool)",
  
  // Events
  "event WellMinted(uint256 indexed tokenId, string location, uint256 capacity, address fieldPartner)",
  "event WellBurned(uint256 indexed tokenId, address burner, string reason)"
]

export const CHAINLINK_AUTOMATION_ABI = [
  "function getActiveWells() external view returns (uint256[])",
  "function interval() external view returns (uint256)",
  "function lastTimeStamp() external view returns (uint256)",
  "function upkeepCounter() external view returns (uint256)",
  "function addWellToAutomation(uint256 tokenId) external",
  
  // Events
  "event UpkeepPerformed(uint256 indexed timestamp, uint256 wellsProcessed)",
  "event YieldRateUpdated(uint256 indexed tokenId, uint256 newRate)"
]

export const CHAINLINK_DATA_FEEDS_ABI = [
  "function getLatestPrice() external view returns (int256)",
  "function getCurrentYieldRate() external view returns (uint256)",
  "function updateYieldBasedOnMarket(uint256[] memory tokenIds) external",
  "function updateAllWellsYield() external",
  "function getPriceFeedInfo() external view returns (address, int256, uint256, uint8)",
  
  // Events
  "event YieldRateAdjusted(uint256 indexed tokenId, uint256 newRate, int256 triggerPrice)",
  "event PriceUpdated(int256 newPrice, uint256 timestamp)"
]

export const CHAINLINK_FUNCTIONS_ABI = [
  "function requestWellData(uint256 tokenId, uint64 subscriptionId, uint32 gasLimit, bytes32 donID) external returns (bytes32)",
  "function verificationInProgress(uint256) external view returns (bool)",
  "function s_lastResponse() external view returns (bytes)",
  "function s_lastError() external view returns (bytes)",
  "function manuallyUpdateWellData(uint256 tokenId, bool isActive, uint256 capacity, uint256 peopleServed) external",
  
  // Events
  "event RequestSent(bytes32 indexed requestId, uint256 indexed tokenId)",
  "event WellDataUpdated(uint256 indexed tokenId, bool isActive, uint256 capacity, uint256 peopleServed)"
]

// Contract instance helpers
export const getContract = (address: string, abi: string[], provider: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(address, abi, provider)
}

export const getWaternityRouter = (provider: ethers.Provider | ethers.Signer) => {
  return getContract(CONTRACT_ADDRESSES.WATERNITY_ROUTER, WATERNITY_ROUTER_ABI, provider)
}

export const getWaterNFT = (provider: ethers.Provider | ethers.Signer) => {
  return getContract(CONTRACT_ADDRESSES.WATER_NFT, WATER_NFT_ABI, provider)
}

export const getChainlinkAutomation = (provider: ethers.Provider | ethers.Signer) => {
  return getContract(CONTRACT_ADDRESSES.CHAINLINK_AUTOMATION, CHAINLINK_AUTOMATION_ABI, provider)
}

export const getChainlinkDataFeeds = (provider: ethers.Provider | ethers.Signer) => {
  return getContract(CONTRACT_ADDRESSES.CHAINLINK_DATA_FEEDS, CHAINLINK_DATA_FEEDS_ABI, provider)
}

export const getChainlinkFunctions = (provider: ethers.Provider | ethers.Signer) => {
  return getContract(CONTRACT_ADDRESSES.CHAINLINK_FUNCTIONS, CHAINLINK_FUNCTIONS_ABI, provider)
}

// Utility functions
export const formatPrice = (price: bigint, decimals: number = 8): string => {
  return (Number(price) / Math.pow(10, decimals)).toFixed(2)
}

export const formatYieldRate = (rate: bigint): string => {
  return (Number(rate) / 100).toFixed(2) + '%'
}

export const formatTimestamp = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleString()
}

// Load deployed addresses
export const loadDeployedAddresses = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch('/deployed-addresses.json')
    const addresses = await response.json()
    return addresses
  } catch (error) {
    console.error('Failed to load deployed addresses:', error)
    return {}
  }
}
