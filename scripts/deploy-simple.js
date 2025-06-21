const { ethers } = require("hardhat")
const { updateEnvFile } = require("./update-env")

async function main() {
  console.log("🚀 Starting Waternity deployment...")

  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)))

  // Deploy WaterNFT
  console.log("\n🏗️ Deploying WaterNFT...")
  const WaterNFT = await ethers.getContractFactory("WaterNFT")
  const waterNFT = await WaterNFT.deploy()
  await waterNFT.waitForDeployment()
  const waterNFTAddress = await waterNFT.getAddress()
  console.log("WaterNFT deployed to:", waterNFTAddress)

  // Deploy WellRegistry
  console.log("\n📋 Deploying WellRegistry...")
  const WellRegistry = await ethers.getContractFactory("WellRegistry")
  const wellRegistry = await WellRegistry.deploy(waterNFTAddress)
  await wellRegistry.waitForDeployment()
  const wellRegistryAddress = await wellRegistry.getAddress()
  console.log("WellRegistry deployed to:", wellRegistryAddress)

  // Deploy mock token for StakingVault
  console.log("\n💵 Deploying Mock Token...")
  const MockToken = await ethers.getContractFactory("MockToken")
  const mockToken = await MockToken.deploy()
  await mockToken.waitForDeployment()
  const mockTokenAddress = await mockToken.getAddress()
  console.log("MockToken deployed to:", mockTokenAddress)

  // Deploy StakingVault
  console.log("\n💰 Deploying StakingVault...")
  const StakingVault = await ethers.getContractFactory("StakingVault")
  const stakingVault = await StakingVault.deploy(mockTokenAddress, wellRegistryAddress)
  await stakingVault.waitForDeployment()
  const stakingVaultAddress = await stakingVault.getAddress()
  console.log("StakingVault deployed to:", stakingVaultAddress)

  // Deploy WaternityRouter (dengan dummy addresses untuk contracts yang tidak ada)
  console.log("\n🌐 Deploying WaternityRouter...")
  const WaternityRouter = await ethers.getContractFactory("WaternityRouter")
  const waternityRouter = await WaternityRouter.deploy(
    waterNFTAddress,
    wellRegistryAddress,
    stakingVaultAddress,
    ethers.ZeroAddress, // dummy untuk functionsContract
    ethers.ZeroAddress, // dummy untuk automationContract
    ethers.ZeroAddress  // dummy untuk vrfContract
  )
  await waternityRouter.waitForDeployment()
  const waternityRouterAddress = await waternityRouter.getAddress()
  console.log("WaternityRouter deployed to:", waternityRouterAddress)

  // Setup initial data
  console.log("\n⚙️ Setting up initial configuration...")

  // Authorize deployer as partner
  await waterNFT.authorizePartner(deployer.address)
  console.log("✅ Deployer authorized as partner")

  // Update .env file with deployed addresses
  const contractAddresses = {
    WATERNITY_ROUTER_ADDRESS: waternityRouterAddress,
    WATER_NFT_ADDRESS: waterNFTAddress,
    STAKING_VAULT_ADDRESS: stakingVaultAddress,
    WELL_REGISTRY_ADDRESS: wellRegistryAddress,
  }

  updateEnvFile(contractAddresses)

  console.log("\n🎉 Deployment completed successfully!")
  console.log("\n📋 Contract Addresses:")
  console.log("=".repeat(50))
  console.log(`WaterNFT:           ${waterNFTAddress}`)
  console.log(`WellRegistry:       ${wellRegistryAddress}`)
  console.log(`StakingVault:       ${stakingVaultAddress}`)
  console.log(`WaternityRouter:    ${waternityRouterAddress}`)
  console.log("=".repeat(50))

  // Save addresses to file
  const addresses = {
    WATER_NFT: waterNFTAddress,
    WELL_REGISTRY: wellRegistryAddress,
    STAKING_VAULT: stakingVaultAddress,
    WATERNITY_ROUTER: waternityRouterAddress,
    MOCK_TOKEN: mockTokenAddress,
  }

  const fs = require("fs")
  fs.writeFileSync("./deployed-addresses.json", JSON.stringify(addresses, null, 2))
  console.log("📄 Contract addresses saved to deployed-addresses.json")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 