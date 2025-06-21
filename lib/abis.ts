// Simplified ABIs dengan fungsi-fungsi penting saja

export const WaterNFTABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "capacity", "type": "uint256" },
      { "internalType": "uint256", "name": "peopleServed", "type": "uint256" },
      { "internalType": "string", "name": "uri", "type": "string" }
    ],
    "name": "mintWell",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getWellData",
    "outputs": [
      { "internalType": "string", "name": "location", "type": "string" },
      { "internalType": "uint256", "name": "capacity", "type": "uint256" },
      { "internalType": "uint256", "name": "peopleServed", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const StakingVaultABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "wellId", "type": "uint256" }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getStakeInfo",
    "outputs": [
      { "internalType": "uint256", "name": "totalStaked", "type": "uint256" },
      { "internalType": "uint256", "name": "rewards", "type": "uint256" },
      { "internalType": "uint256", "name": "lastUpdateTime", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const WellRegistryABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "wellId", "type": "uint256" }],
    "name": "registerWell",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "wellId", "type": "uint256" }],
    "name": "getWellInfo",
    "outputs": [
      { "internalType": "bool", "name": "isRegistered", "type": "bool" },
      { "internalType": "uint256", "name": "totalStaked", "type": "uint256" },
      { "internalType": "uint256", "name": "stakersCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const MockTokenABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const; 