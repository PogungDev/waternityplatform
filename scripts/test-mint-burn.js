const { ethers } = require("hardhat")

async function main() {
  console.log("🧪 Testing Mint and Burn Functionality...")
  console.log("========================================")

  const [deployer, user1, user2] = await ethers.getSigners()
  console.log("Testing with accounts:")
  console.log("Deployer:", deployer.address)
  console.log("User1:", user1.address)
  console.log("User2:", user2.address)

  // Load deployed contract addresses
  let addresses
  try {
    addresses = require("../deployed-addresses.json")
  } catch (error) {
    console.error("❌ Please deploy contracts first: npm run deploy:chainlink")
    process.exit(1)
  }

  // Get contract instances
  const WaterNFT = await ethers.getContractFactory("WaterNFT")
  const waterNFT = WaterNFT.attach(addresses.WATER_NFT)

  const WaternityRouter = await ethers.getContractFactory("WaternityRouter")
  const router = WaternityRouter.attach(addresses.WATERNITY_ROUTER)

  const MockToken = await ethers.getContractFactory("MockToken")
  const mockToken = MockToken.attach(addresses.MOCK_TOKEN)

  console.log("\n📊 Initial State:")
  const totalMinted = await waterNFT.getTotalMinted()
  console.log(`Total Wells Minted: ${totalMinted}`)

  // =================
  // TEST 1: MINT WELL USING ROUTER
  // =================
  console.log("\n🏗️ TEST 1: Minting Well via Router...")
  
  try {
    const mintTx = await router.mintWell(
      user1.address,
      "Surabaya, Indonesia",
      2000, // capacity
      100,  // people served
      "https://ipfs.io/test-well-1.json"
    )
    const receipt = await mintTx.wait()
    
    // Find the minted token ID from events
    const wellMintedEvent = receipt.logs.find(log => {
      try {
        const parsed = waterNFT.interface.parseLog(log)
        return parsed.name === 'WellMinted'
      } catch {
        return false
      }
    })
    
    const tokenId = wellMintedEvent ? waterNFT.interface.parseLog(wellMintedEvent).args.tokenId : totalMinted
    
    console.log("✅ Well minted successfully!")
    console.log(`Token ID: ${tokenId}`)
    console.log(`Owner: ${await waterNFT.ownerOf(tokenId)}`)
    
    // Check well data
    const wellData = await waterNFT.getWellData(tokenId)
    console.log(`Location: ${wellData.location}`)
    console.log(`Capacity: ${wellData.capacity} L/day`)
    console.log(`People Served: ${wellData.peopleServed}`)
    console.log(`Is Active: ${wellData.isActive}`)

  } catch (error) {
    console.error("❌ Mint failed:", error.reason || error.message)
  }

  // =================
  // TEST 2: MINT DIRECTLY FROM WATERNFT
  // =================
  console.log("\n🏗️ TEST 2: Minting Well directly from WaterNFT...")
  
  try {
    const mintTx = await waterNFT.mintWell(
      user2.address,
      "Medan, Indonesia", 
      1800,
      80,
      "https://ipfs.io/test-well-2.json"
    )
    await mintTx.wait()
    
    const newTotalMinted = await waterNFT.getTotalMinted()
    const tokenId = newTotalMinted - 1n // Latest minted token
    
    console.log("✅ Well minted successfully!")
    console.log(`Token ID: ${tokenId}`)
    console.log(`Owner: ${await waterNFT.ownerOf(tokenId)}`)
    
  } catch (error) {
    console.error("❌ Direct mint failed:", error.reason || error.message)
  }

  // =================
  // TEST 3: BURN WELL (Should fail with active stakes)
  // =================
  console.log("\n🔥 TEST 3: Testing Burn with Active Stakes...")
  
  try {
    // Try to stake some amount first
    const stakeAmount = ethers.parseUnits("100", 6) // 100 USDC
    
    // Mint some tokens for user1
    await mockToken.mint(user1.address, stakeAmount * 2n)
    
    // Approve and stake
    const StakingVault = await ethers.getContractFactory("StakingVault")
    const stakingVault = StakingVault.attach(addresses.STAKING_VAULT)
    
    await mockToken.connect(user1).approve(addresses.STAKING_VAULT, stakeAmount)
    await stakingVault.connect(user1).stake(0, stakeAmount) // Stake to well 0
    
    // Now try to burn - should fail
    console.log("Attempting to burn well with active stakes...")
    await router.connect(user1).burnWell(0, "Testing burn with stakes")
    
  } catch (error) {
    console.log("✅ Burn correctly failed with active stakes:", error.reason || error.message)
  }

  // =================
  // TEST 4: BURN WELL (After unstaking)
  // =================
  console.log("\n🔥 TEST 4: Testing Burn after Unstaking...")
  
  try {
    // First unstake all funds
    const StakingVault = await ethers.getContractFactory("StakingVault")
    const stakingVault = StakingVault.attach(addresses.STAKING_VAULT)
    
    const stakeInfo = await stakingVault.getStakeInfo(user1.address, 0)
    if (stakeInfo.amount > 0) {
      console.log(`Unstaking ${ethers.formatUnits(stakeInfo.amount, 6)} USDC...`)
      await stakingVault.connect(user1).unstake(0, stakeInfo.amount)
    }
    
    // Now try to burn - should succeed
    console.log("Attempting to burn well after unstaking...")
    const burnTx = await router.connect(user1).burnWell(0, "Well decommissioned")
    await burnTx.wait()
    
    console.log("✅ Well burned successfully!")
    
    // Check if well still exists
    const exists = await waterNFT.wellExists(0)
    console.log(`Well 0 exists: ${exists}`)
    
  } catch (error) {
    console.error("❌ Burn failed:", error.reason || error.message)
  }

  // =================
  // TEST 5: EMERGENCY BURN
  // =================
  console.log("\n🚨 TEST 5: Testing Emergency Burn...")
  
  try {
    // Emergency burn as owner
    const tokenId = 1 // Should exist from test 2
    const exists = await waterNFT.wellExists(tokenId)
    
    if (exists) {
      console.log(`Emergency burning well ${tokenId}...`)
      const burnTx = await router.emergencyBurnWell(tokenId, "Emergency maintenance")
      await burnTx.wait()
      
      console.log("✅ Emergency burn successful!")
      
      const stillExists = await waterNFT.wellExists(tokenId)
      console.log(`Well ${tokenId} exists after burn: ${stillExists}`)
    } else {
      console.log("Well doesn't exist for emergency burn test")
    }
    
  } catch (error) {
    console.error("❌ Emergency burn failed:", error.reason || error.message)
  }

  // =================
  // FINAL STATE
  // =================
  console.log("\n📊 Final State:")
  const finalTotalMinted = await waterNFT.getTotalMinted()
  console.log(`Total Wells Minted: ${finalTotalMinted}`)
  
  // Check remaining wells
  for (let i = 0; i < finalTotalMinted; i++) {
    const exists = await waterNFT.wellExists(i)
    if (exists) {
      const owner = await waterNFT.ownerOf(i)
      const wellData = await waterNFT.getWellData(i)
      console.log(`Well ${i}: Owner=${owner}, Location=${wellData.location}`)
    } else {
      console.log(`Well ${i}: BURNED`)
    }
  }

  console.log("\n🎉 Mint and Burn testing completed!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 