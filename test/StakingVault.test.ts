import { expect } from "chai"
import { ethers } from "hardhat"
import type { StakingVault, WellRegistry } from "../typechain-types"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("StakingVault", () => {
  let stakingVault: StakingVault
  let wellRegistry: WellRegistry
  let mockUSDC: any
  let owner: SignerWithAddress
  let user: SignerWithAddress

  beforeEach(async () => {
    ;[owner, user] = await ethers.getSigners()

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20")
    mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6)
    await mockUSDC.deployed()

    // Deploy WellRegistry (mock)
    const WellRegistryFactory = await ethers.getContractFactory("WellRegistry")
    wellRegistry = await WellRegistryFactory.deploy(ethers.constants.AddressZero)
    await wellRegistry.deployed()

    // Deploy StakingVault
    const StakingVaultFactory = await ethers.getContractFactory("StakingVault")
    stakingVault = await StakingVaultFactory.deploy(mockUSDC.address, wellRegistry.address)
    await stakingVault.deployed()

    // Mint USDC to user
    await mockUSDC.mint(user.address, ethers.utils.parseUnits("10000", 6))
    await mockUSDC.connect(user).approve(stakingVault.address, ethers.utils.parseUnits("10000", 6))
  })

  describe("Staking", () => {
    it("Should allow user to stake USDC", async () => {
      const stakeAmount = ethers.utils.parseUnits("1000", 6)

      await expect(stakingVault.connect(user).stake(1, stakeAmount))
        .to.emit(stakingVault, "Staked")
        .withArgs(user.address, 1, stakeAmount)

      const stakeInfo = await stakingVault.getStakeInfo(user.address, 1)
      expect(stakeInfo.amount).to.equal(stakeAmount)
    })

    it("Should update total staked per well", async () => {
      const stakeAmount = ethers.utils.parseUnits("1000", 6)

      await stakingVault.connect(user).stake(1, stakeAmount)

      expect(await stakingVault.totalStakedPerWell(1)).to.equal(stakeAmount)
    })

    it("Should set default yield rate", async () => {
      const stakeAmount = ethers.utils.parseUnits("1000", 6)

      await stakingVault.connect(user).stake(1, stakeAmount)

      expect(await stakingVault.yieldRatePerWell(1)).to.equal(300) // 3%
    })

    it("Should not allow staking 0 amount", async () => {
      await expect(stakingVault.connect(user).stake(1, 0)).to.be.revertedWith("Amount must be greater than 0")
    })
  })

  describe("Rewards", () => {
    beforeEach(async () => {
      const stakeAmount = ethers.utils.parseUnits("1000", 6)
      await stakingVault.connect(user).stake(1, stakeAmount)

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]) // 1 week
      await ethers.provider.send("evm_mine", [])
    })

    it("Should calculate pending rewards correctly", async () => {
      const pendingRewards = await stakingVault.getPendingRewards(user.address, 1)
      expect(pendingRewards).to.be.gt(0)
    })

    it("Should allow claiming rewards", async () => {
      // First, fund the contract with USDC for rewards
      await mockUSDC.mint(stakingVault.address, ethers.utils.parseUnits("1000", 6))

      const initialBalance = await mockUSDC.balanceOf(user.address)

      await expect(stakingVault.connect(user).claimRewards(1)).to.emit(stakingVault, "RewardsClaimed")

      const finalBalance = await mockUSDC.balanceOf(user.address)
      expect(finalBalance).to.be.gt(initialBalance)
    })
  })

  describe("Unstaking", () => {
    beforeEach(async () => {
      const stakeAmount = ethers.utils.parseUnits("1000", 6)
      await stakingVault.connect(user).stake(1, stakeAmount)
    })

    it("Should allow user to unstake", async () => {
      const unstakeAmount = ethers.utils.parseUnits("500", 6)

      await expect(stakingVault.connect(user).unstake(1, unstakeAmount))
        .to.emit(stakingVault, "Unstaked")
        .withArgs(user.address, 1, unstakeAmount)
    })

    it("Should not allow unstaking more than staked", async () => {
      const unstakeAmount = ethers.utils.parseUnits("2000", 6)

      await expect(stakingVault.connect(user).unstake(1, unstakeAmount)).to.be.revertedWith(
        "Insufficient staked amount",
      )
    })
  })
})
