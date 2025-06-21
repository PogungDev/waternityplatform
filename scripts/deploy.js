const { ethers } = require("hardhat")
const { updateEnvFile } = require("./update-env")

async function main() {
  console.log("🚀 Starting Waternity deployment...")

  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy mock USDC for testnet
  console.log("\n📄 Deploying Mock USDC...")
  const MockERC20 = await ethers.getContractFactory("MockERC20")
  const mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6)
  await mockUSDC.deployed()
  console.log("Mock USDC deployed to:", mockUSDC.address)

  // Deploy WaterNFT
  console.log("\n🏗️ Deploying WaterNFT...")
  const WaterNFT = await ethers.getContractFactory("WaterNFT")
  const waterNFT = await WaterNFT.deploy()
  await waterNFT.deployed()
  console.log("WaterNFT deployed to:", waterNFT.address)

  // Deploy WellRegistry
  console.log("\n📋 Deploying WellRegistry...")
  const WellRegistry = await ethers.getContractFactory("WellRegistry")
  const wellRegistry = await WellRegistry.deploy(waterNFT.address)
  await wellRegistry.deployed()
  console.log("WellRegistry deployed to:", wellRegistry.address)

  // Deploy StakingVault
  console.log("\n💰 Deploying StakingVault...")
  const StakingVault = await ethers.getContractFactory("StakingVault")
  const stakingVault = await StakingVault.deploy(mockUSDC.address, wellRegistry.address)
  await stakingVault.deployed()
  console.log("StakingVault deployed to:", stakingVault.address)

  // Deploy Chainlink contracts (mocked for testnet)
  console.log("\n🔗 Deploying Chainlink contracts...")

  const WaternityFunctions = await ethers.getContractFactory("WaternityFunctions")
  const functionsContract = await WaternityFunctions.deploy(
    "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", // Sepolia Functions Router
  )
  await functionsContract.deployed()
  console.log("WaternityFunctions deployed to:", functionsContract.address)

  const WaternityAutomation = await ethers.getContractFactory("WaternityAutomation")
  const automationContract = await WaternityAutomation.deploy(
    stakingVault.address,
    604800, // 1 week interval
  )
  await automationContract.deployed()
  console.log("WaternityAutomation deployed to:", automationContract.address)

  const WaternityVRF = await ethers.getContractFactory("WaternityVRF")
  const vrfContract = await WaternityVRF.deploy(
    1, // subscription ID
    stakingVault.address,
  )
  await vrfContract.deployed()
  console.log("WaternityVRF deployed to:", vrfContract.address)

  // Deploy WaternityRouter
  console.log("\n🌐 Deploying WaternityRouter...")
  const WaternityRouter = await ethers.getContractFactory("WaternityRouter")
  const waternityRouter = await WaternityRouter.deploy(
    waterNFT.address,
    wellRegistry.address,
    stakingVault.address,
    functionsContract.address,
    automationContract.address,
    vrfContract.address,
  )
  await waternityRouter.deployed()
  console.log("WaternityRouter deployed to:", waternityRouter.address)

  // Setup initial data
  console.log("\n⚙️ Setting up initial configuration...")

  // Authorize deployer as partner for demo
  await waterNFT.authorizePartner(deployer.address)
  console.log("✅ Deployer authorized as partner")

  // Mint some demo wells
  console.log("\n🏗️ Minting demo wells...")

  const wells = [
    {
      location: "Lombok, Indonesia",
      capacity: 5000,
      peopleServed: 250,
      uri: "ipfs://QmDemo1",
    },
    {
      location: "Flores, Indonesia",
      capacity: 3500,
      peopleServed: 180,
      uri: "ipfs://QmDemo2",
    },
    {
      location: "Sumba, Indonesia",
      capacity: 4200,
      peopleServed: 210,
      uri: "ipfs://QmDemo3",
    },
  ]

  for (let i = 0; i < wells.length; i++) {
    const well = wells[i]
    await waterNFT.mintWell(deployer.address, well.location, well.capacity, well.peopleServed, well.uri)

    // Register well
    await wellRegistry.registerWell(i)

    // Add to automation
    await automationContract.addWell(i)

    console.log(`✅ Well ${i + 1} minted and registered: ${well.location}`)
  }

  // Mint some USDC to deployer for testing
  await mockUSDC.mint(deployer.address, ethers.utils.parseUnits("100000", 6))
  console.log("✅ Minted 100,000 USDC to deployer for testing")

  console.log("\n🎉 Deployment completed successfully!")
  console.log("\n📋 Contract Addresses:")
  console.log("=".repeat(50))
  console.log(`Mock USDC:          ${mockUSDC.address}`)
  console.log(`WaterNFT:           ${waterNFT.address}`)
  console.log(`WellRegistry:       ${wellRegistry.address}`)
  console.log(`StakingVault:       ${stakingVault.address}`)
  console.log(`WaternityFunctions: ${functionsContract.address}`)
  console.log(`WaternityAutomation:${automationContract.address}`)
  console.log(`WaternityVRF:       ${vrfContract.address}`)
  console.log(`WaternityRouter:    ${waternityRouter.address}`)
  console.log("=".repeat(50))

  // Save addresses to file for frontend
  const addresses = {
    MOCK_USDC: mockUSDC.address,
    WATER_NFT: waterNFT.address,
    WELL_REGISTRY: wellRegistry.address,
    STAKING_VAULT: stakingVault.address,
    WATERNITY_FUNCTIONS: functionsContract.address,
    WATERNITY_AUTOMATION: automationContract.address,
    WATERNITY_VRF: vrfContract.address,
    WATERNITY_ROUTER: waternityRouter.address,
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
