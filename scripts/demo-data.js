const { ethers } = require("hardhat")

async function main() {
  console.log("🌱 Setting up demo data for Waternity...")

  // Load deployed addresses
  const addresses = require("../deployed-addresses.json")

  const [deployer, investor1, investor2] = await ethers.getSigners()

  // Get contract instances
  const mockUSDC = await ethers.getContractAt("MockERC20", addresses.MOCK_USDC)
  const stakingVault = await ethers.getContractAt("StakingVault", addresses.STAKING_VAULT)

  console.log("💰 Minting USDC to demo investors...")

  // Mint USDC to investors
  await mockUSDC.mint(investor1.address, ethers.utils.parseUnits("50000", 6))
  await mockUSDC.mint(investor2.address, ethers.utils.parseUnits("30000", 6))

  console.log(`✅ Minted 50,000 USDC to ${investor1.address}`)
  console.log(`✅ Minted 30,000 USDC to ${investor2.address}`)

  // Approve staking vault
  await mockUSDC.connect(investor1).approve(stakingVault.address, ethers.utils.parseUnits("50000", 6))
  await mockUSDC.connect(investor2).approve(stakingVault.address, ethers.utils.parseUnits("30000", 6))

  console.log("📈 Creating demo stakes...")

  // Create some demo stakes
  await stakingVault.connect(investor1).stake(0, ethers.utils.parseUnits("10000", 6))
  await stakingVault.connect(investor1).stake(1, ethers.utils.parseUnits("5000", 6))
  await stakingVault.connect(investor2).stake(0, ethers.utils.parseUnits("15000", 6))
  await stakingVault.connect(investor2).stake(2, ethers.utils.parseUnits("8000", 6))

  console.log("✅ Demo stakes created:")
  console.log(`   - Investor1 staked 10,000 USDC in Well #0`)
  console.log(`   - Investor1 staked 5,000 USDC in Well #1`)
  console.log(`   - Investor2 staked 15,000 USDC in Well #0`)
  console.log(`   - Investor2 staked 8,000 USDC in Well #2`)

  console.log("\n🎉 Demo data setup completed!")
  console.log("\n👥 Demo Accounts:")
  console.log("=".repeat(50))
  console.log(`Deployer:  ${deployer.address}`)
  console.log(`Investor1: ${investor1.address}`)
  console.log(`Investor2: ${investor2.address}`)
  console.log("=".repeat(50))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
