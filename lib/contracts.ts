export const CONTRACTS = {
  WATER_NFT: "0x1234567890123456789012345678901234567890",
  WELL_REGISTRY: "0x2345678901234567890123456789012345678901",
  STAKING_VAULT: "0x3456789012345678901234567890123456789012",
  WATERNITY_ROUTER: "0x4567890123456789012345678901234567890123",
  USDC_TOKEN: "0x5678901234567890123456789012345678901234",
} as const

export const WATER_NFT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "location", type: "string" },
      { name: "capacity", type: "uint256" },
      { name: "peopleServed", type: "uint256" },
      { name: "tokenURI", type: "string" },
    ],
    name: "mintWell",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getWellData",
    outputs: [
      {
        components: [
          { name: "location", type: "string" },
          { name: "capacity", type: "uint256" },
          { name: "peopleServed", type: "uint256" },
          { name: "isActive", type: "bool" },
          { name: "fieldPartner", type: "address" },
          { name: "createdAt", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const

export const STAKING_VAULT_ABI = [
  {
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "getPendingRewards",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

// Contract addresses configuration
export const contractAddresses = {
  waternityRouter: process.env.NEXT_PUBLIC_WATERNITY_ROUTER_ADDRESS || "",
  waterNFT: process.env.NEXT_PUBLIC_WATER_NFT_ADDRESS || "",
  stakingVault: process.env.NEXT_PUBLIC_STAKING_VAULT_ADDRESS || "",
  wellRegistry: process.env.NEXT_PUBLIC_WELL_REGISTRY_ADDRESS || "",
} as const;

// Chain configuration
export const chainConfig = {
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "31337"),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545",
} as const;

// Helper function to check if contracts are deployed
export const areContractsDeployed = () => {
  return Object.values(contractAddresses).every(address => address && address !== "");
};
