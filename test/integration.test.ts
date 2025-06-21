import { expect } from "chai"
import { ethers } from "hardhat"
import type { WaterNFT, WellRegistry, StakingVault, WaternityRouter } from "../typechain-types"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("Integration Tests", () => {
  let waterNFT: WaterNFT
  let wellRegistry: WellRegistry
  let stakingVault: StakingVault
  let waternityRouter: WaternityRouter
  let mockUSDC: any
  let owner: SignerWithAddress
  let partner: SignerWithAddress
  let investor: SignerWithAddress

  beforeEach(async () => {
    ;[owner, partner, investor] = await ethers.getSigners()

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20")
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6)
    await mockUSDC.deployed()

    // Deploy WaterNFT
    const WaterNFTFactory = await ethers.getContractFactory("WaterNFT")
    waterNFT = await WaterNFTFactory.deploy()
    await waterNFT.deployed()

    // Deploy WellRegistry
    const WellRegistryFactory = await ethers.getContractFactory("WellRegistry")
    wellRegistry = await WellRegistryFactory.deploy(waterNFT.address)
    await wellRegistry.deployed()

    // Deploy StakingVault
    const StakingVaultFactory = await ethers.getContractFactory("StakingVault")
    stakingVault = await StakingVaultFactory.deploy(mockUSDC.address, wellRegistry.address)
    await stakingVault.deployed()

    // Deploy WaternityRouter
    const WaternityRouterFactory = await ethers.getContractFactory("WaternityRouter")
    waternityRouter = await WaternityRouterFactory.deploy(
      waterNFT.address,
      wellRegistry.address,
      stakingVault.address,
      ethers.constants.AddressZero, // functions
      ethers.constants.AddressZero, // automation
      ethers.constants.AddressZero, // vrf
    )
    await waternityRouter.deployed()

    // Setup
    await waterNFT.authorizePartner(partner.address)
    await mockUSDC.mint(investor.address, ethers.utils.parseUnits("10000", 6))
    await mockUSDC.connect(investor).approve(stakingVault.address, ethers.utils.parseUnits("10000", 6))
  })

  describe("End-to-End Flow", () => {
    it("Should complete full investor journey", async () => {
      // 1. Partner mints well NFT
      await waterNFT.connect(partner).mintWell(partner.address, "Lombok, Indonesia", 5000, 250, "ipfs://test-uri")

      // 2. Register well in registry
      await wellRegistry.registerWell(0)

      // 3. Investor stakes via router
      const stakeAmount = ethers.utils.parseUnits("1000", 6)
      await waternityRouter.connect(investor).stakeAndRegister(0, stakeAmount)

      // 4. Verify staking worked
      const stakeInfo = await stakingVault.getStakeInfo(investor.address, 0)
      expect(stakeInfo.amount).to.equal(stakeAmount)

      // 5. Fast forward time and check rewards
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]) // 1 week
      await ethers.provider.send("evm_mine", [])

      const pendingRewards = await stakingVault.getPendingRewards(investor.address, 0)
      expect(pendingRewards).to.be.gt(0)

      // 6. Get well details via router
      const [wellData, registryInfo, rewards] = await waternityRouter.getWellDetails(0)
      expect(wellData.location).to.equal("Lombok, Indonesia")
      expect(registryInfo.totalStaked).to.equal(stakeAmount)
      expect(rewards).to.be.gt(0)
    })

    it("Should handle multiple wells and investors", async () => {
      // Mint multiple wells
      await waterNFT.connect(partner).mintWell(partner.address, "Lombok, Indonesia", 5000, 250, "ipfs://test-uri-1")

      await waterNFT.connect(partner).mintWell(partner.address, "Flores, Indonesia", 3000, 150, "ipfs://test-uri-2")

      // Register wells
      await wellRegistry.registerWell(0)
      await wellRegistry.registerWell(1)

      // Multiple investors stake
      const [investor2] = await ethers.getSigners()
      await mockUSDC.mint(investor2.address, ethers.utils.parseUnits("5000", 6))
      await mockUSDC.connect(investor2).approve(stakingVault.address, ethers.utils.parseUnits("5000", 6))

      await stakingVault.connect(investor).stake(0, ethers.utils.parseUnits("1000", 6))
      await stakingVault.connect(investor2).stake(0, ethers.utils.parseUnits("2000", 6))
      await stakingVault.connect(investor).stake(1, ethers.utils.parseUnits("500", 6))

      // Verify total staked amounts
      expect(await stakingVault.totalStakedPerWell(0)).to.equal(ethers.utils.parseUnits("3000", 6))
      expect(await stakingVault.totalStakedPerWell(1)).to.equal(ethers.utils.parseUnits("500", 6))
    })
  })
})
