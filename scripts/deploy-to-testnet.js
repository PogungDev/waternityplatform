const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Testnet Deployment for Vercel...");
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Deploying to network: ${network.name} (chainId: ${network.chainId})`);
  
  const [deployer] = await ethers.getSigners();
  console.log(`💼 Deploying with account: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("❌ Insufficient balance! Need at least 0.01 ETH for deployment");
    console.log("💡 Get testnet ETH from:");
    console.log("   - Sepolia: https://sepoliafaucet.com/");
    console.log("   - Base Sepolia: https://bridge.base.org/");
    process.exit(1);
  }

  console.log("\n=== DEPLOYING CORE CONTRACTS ===");
  
  // 1. Deploy MockToken
  console.log("📝 Deploying MockToken...");
  const MockToken = await ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy();
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log(`✅ MockToken deployed to: ${mockTokenAddress}`);

  // 2. Deploy WaterNFT
  console.log("📝 Deploying WaterNFT...");
  const WaterNFT = await ethers.getContractFactory("WaterNFT");
  const waterNFT = await WaterNFT.deploy();
  await waterNFT.waitForDeployment();
  const waterNFTAddress = await waterNFT.getAddress();
  console.log(`✅ WaterNFT deployed to: ${waterNFTAddress}`);

  // 3. Deploy WellRegistry
  console.log("📝 Deploying WellRegistry...");
  const WellRegistry = await ethers.getContractFactory("WellRegistry");
  const wellRegistry = await WellRegistry.deploy();
  await wellRegistry.waitForDeployment();
  const wellRegistryAddress = await wellRegistry.getAddress();
  console.log(`✅ WellRegistry deployed to: ${wellRegistryAddress}`);

  // 4. Deploy StakingVault
  console.log("📝 Deploying StakingVault...");
  const StakingVault = await ethers.getContractFactory("StakingVault");
  const stakingVault = await StakingVault.deploy(
    mockTokenAddress,
    waterNFTAddress
  );
  await stakingVault.waitForDeployment();
  const stakingVaultAddress = await stakingVault.getAddress();
  console.log(`✅ StakingVault deployed to: ${stakingVaultAddress}`);

  console.log("\n=== DEPLOYING CHAINLINK CONTRACTS ===");

  // 5. Deploy ChainlinkDataFeeds
  console.log("📝 Deploying ChainlinkDataFeeds...");
  const ChainlinkDataFeeds = await ethers.getContractFactory("ChainlinkDataFeeds");
  // Sepolia ETH/USD feed: 0x694AA1769357215DE4FAC081bf1f309aDC325306
  const priceFeed = network.chainId === 11155111 
    ? "0x694AA1769357215DE4FAC081bf1f309aDC325306" // Sepolia
    : "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1"; // Base Sepolia
    
  const chainlinkDataFeeds = await ChainlinkDataFeeds.deploy(
    priceFeed,
    stakingVaultAddress
  );
  await chainlinkDataFeeds.waitForDeployment();
  const chainlinkDataFeedsAddress = await chainlinkDataFeeds.getAddress();
  console.log(`✅ ChainlinkDataFeeds deployed to: ${chainlinkDataFeedsAddress}`);

  // 6. Deploy ChainlinkAutomation
  console.log("📝 Deploying ChainlinkAutomation...");
  const ChainlinkAutomation = await ethers.getContractFactory("ChainlinkAutomation");
  const chainlinkAutomation = await ChainlinkAutomation.deploy(
    stakingVaultAddress,
    3600 // 1 hour interval
  );
  await chainlinkAutomation.waitForDeployment();
  const chainlinkAutomationAddress = await chainlinkAutomation.getAddress();
  console.log(`✅ ChainlinkAutomation deployed to: ${chainlinkAutomationAddress}`);

  // 7. Deploy ChainlinkFunctions
  console.log("📝 Deploying ChainlinkFunctions...");
  const ChainlinkFunctions = await ethers.getContractFactory("ChainlinkFunctions");
  // Functions router addresses
  const functionsRouter = network.chainId === 11155111
    ? "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0" // Sepolia
    : "0xf9B8fc078197181C841c296C876945aaa425B278"; // Base Sepolia
    
  const chainlinkFunctions = await ChainlinkFunctions.deploy(
    functionsRouter,
    waterNFTAddress,
    wellRegistryAddress
  );
  await chainlinkFunctions.waitForDeployment();
  const chainlinkFunctionsAddress = await chainlinkFunctions.getAddress();
  console.log(`✅ ChainlinkFunctions deployed to: ${chainlinkFunctionsAddress}`);

  // 8. Deploy WaternityRouter
  console.log("📝 Deploying WaternityRouter...");
  const WaternityRouter = await ethers.getContractFactory("WaternityRouter");
  const waternityRouter = await WaternityRouter.deploy(
    waterNFTAddress,
    wellRegistryAddress,
    stakingVaultAddress,
    chainlinkAutomationAddress,
    chainlinkDataFeedsAddress,
    chainlinkFunctionsAddress
  );
  await waternityRouter.waitForDeployment();
  const waternityRouterAddress = await waternityRouter.getAddress();
  console.log(`✅ WaternityRouter deployed to: ${waternityRouterAddress}`);

  console.log("\n=== SETTING UP PERMISSIONS ===");

  // Setup permissions
  await waterNFT.setWellRegistry(wellRegistryAddress);
  await waterNFT.setRouter(waternityRouterAddress);
  await wellRegistry.setWaterNFT(waterNFTAddress);
  await wellRegistry.setRouter(waternityRouterAddress);
  await stakingVault.setRouter(waternityRouterAddress);

  console.log("✅ Permissions configured");

  console.log("\n=== CREATING DEMO DATA ===");

  // Mint demo NFTs
  const mintTx1 = await waterNFT.mint(
    deployer.address,
    "Demo Well #1",
    "First demo well for testing",
    "https://api.waternity.io/well/1",
    { lat: "1.2966", lng: "36.8219" } // Nairobi coordinates
  );
  await mintTx1.wait();

  const mintTx2 = await waterNFT.mint(
    deployer.address,
    "Demo Well #2",
    "Second demo well for testing",
    "https://api.waternity.io/well/2",
    { lat: "-1.9441", lng: "30.0619" } // Kigali coordinates
  );
  await mintTx2.wait();

  console.log("✅ Demo NFTs minted");

  // Save addresses
  const addresses = {
    NETWORK: network.name,
    CHAIN_ID: network.chainId.toString(),
    DEPLOYER: deployer.address,
    WATER_NFT: waterNFTAddress,
    WELL_REGISTRY: wellRegistryAddress,
    STAKING_VAULT: stakingVaultAddress,
    WATERNITY_ROUTER: waternityRouterAddress,
    MOCK_TOKEN: mockTokenAddress,
    CHAINLINK_AUTOMATION: chainlinkAutomationAddress,
    CHAINLINK_DATA_FEEDS: chainlinkDataFeedsAddress,
    CHAINLINK_FUNCTIONS: chainlinkFunctionsAddress,
    DEPLOYED_AT: new Date().toISOString(),
    BLOCK_NUMBER: await ethers.provider.getBlockNumber()
  };

  // Save to deployed-addresses.json
  fs.writeFileSync(
    path.join(__dirname, "../deployed-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  // Create .env.production with deployed addresses
  const envContent = `# PRODUCTION DEPLOYMENT ADDRESSES
# Generated on ${new Date().toISOString()}
# Network: ${network.name} (${network.chainId})

NEXT_PUBLIC_WATERNITY_ROUTER_ADDRESS=${waternityRouterAddress}
NEXT_PUBLIC_WATER_NFT_ADDRESS=${waterNFTAddress}
NEXT_PUBLIC_STAKING_VAULT_ADDRESS=${stakingVaultAddress}
NEXT_PUBLIC_WELL_REGISTRY_ADDRESS=${wellRegistryAddress}
NEXT_PUBLIC_MOCK_TOKEN_ADDRESS=${mockTokenAddress}
NEXT_PUBLIC_CHAINLINK_AUTOMATION_ADDRESS=${chainlinkAutomationAddress}
NEXT_PUBLIC_CHAINLINK_DATA_FEEDS_ADDRESS=${chainlinkDataFeedsAddress}
NEXT_PUBLIC_CHAINLINK_FUNCTIONS_ADDRESS=${chainlinkFunctionsAddress}

# Copy these to your Vercel environment variables
`;

  fs.writeFileSync(
    path.join(__dirname, "../.env.production"),
    envContent
  );

  console.log("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
  console.log("\n=== DEPLOYED ADDRESSES ===");
  console.log(JSON.stringify(addresses, null, 2));

  console.log("\n=== NEXT STEPS FOR VERCEL ===");
  console.log("1. Copy contract addresses from .env.production to Vercel dashboard");
  console.log("2. Setup RPC provider (Alchemy/Infura) and add API key");
  console.log("3. Update NEXT_PUBLIC_RPC_URL in Vercel environment");
  console.log("4. Deploy to Vercel with: vercel --prod");
  
  console.log("\n=== USEFUL LINKS ===");
  if (network.chainId === 11155111) {
    console.log(`🔍 Etherscan: https://sepolia.etherscan.io/address/${waternityRouterAddress}`);
  } else if (network.chainId === 84532) {
    console.log(`🔍 Basescan: https://sepolia.basescan.org/address/${waternityRouterAddress}`);
  }
  
  console.log("📖 Documentation: ./DEPLOYMENT_AUDIT.md");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 