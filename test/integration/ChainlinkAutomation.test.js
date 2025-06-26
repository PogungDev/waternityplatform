const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Chainlink Automation Integration", function () {
  let waterNFT;
  let stakingVault;
  let chainlinkAutomation;
  let mockToken;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy contracts in correct order
    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await MockToken.deploy();

    const WaterNFT = await ethers.getContractFactory("WaterNFT");
    waterNFT = await WaterNFT.deploy();

    const StakingVault = await ethers.getContractFactory("StakingVault");
    stakingVault = await StakingVault.deploy(await mockToken.getAddress());

    const ChainlinkAutomation = await ethers.getContractFactory("ChainlinkAutomation");
    chainlinkAutomation = await ChainlinkAutomation.deploy(await stakingVault.getAddress());

    // Setup permissions
    await stakingVault.setAutomationContract(await chainlinkAutomation.getAddress());
    
    // Mint tokens for testing
    await mockToken.mint(addr1.address, ethers.parseEther("10000"));
  });

  describe("Automation Setup", function () {
    it("Should add wells to automation correctly", async function () {
      // Mint a well first
      await waterNFT.mintWell(
        addr1.address,
        "Test Location",
        1000,
        500,
        "ipfs://test"
      );

      // Add well to automation
      await chainlinkAutomation.addWellToAutomation(1);

      const activeWells = await chainlinkAutomation.getActiveWells();
      expect(activeWells.length).to.equal(1);
      expect(activeWells[0]).to.equal(1);
    });

    it("Should not add duplicate wells", async function () {
      await waterNFT.mintWell(addr1.address, "Test", 1000, 500, "ipfs://test");
      
      // Add same well twice
      await chainlinkAutomation.addWellToAutomation(1);
      await chainlinkAutomation.addWellToAutomation(1);

      const activeWells = await chainlinkAutomation.getActiveWells();
      expect(activeWells.length).to.equal(1);
    });
  });

  describe("Upkeep Functionality", function () {
    beforeEach(async function () {
      // Setup a well with staking
      await waterNFT.mintWell(addr1.address, "Test", 1000, 500, "ipfs://test");
      await chainlinkAutomation.addWellToAutomation(1);
      
      // Approve and stake
      await mockToken.connect(addr1).approve(await stakingVault.getAddress(), ethers.parseEther("1000"));
      await stakingVault.connect(addr1).stake(1, ethers.parseEther("1000"));
    });

    it("Should check upkeep needed correctly", async function () {
      // Initially no upkeep needed (just created)
      let [upkeepNeeded,] = await chainlinkAutomation.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;

      // Advance time by 1 hour + 1 second
      await time.increase(3601);

      // Now upkeep should be needed
      [upkeepNeeded,] = await chainlinkAutomation.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.true;
    });

    it("Should perform upkeep and update yield rates", async function () {
      // Advance time to trigger upkeep
      await time.increase(3601);

      // Get initial yield rate
      const initialRate = await stakingVault.getYieldRate(1);

      // Perform upkeep
      await chainlinkAutomation.performUpkeep("0x");

      // Check that yield rate was updated
      const newRate = await stakingVault.getYieldRate(1);
      expect(newRate).to.not.equal(initialRate);

      // Check that upkeep counter increased
      expect(await chainlinkAutomation.upkeepCounter()).to.equal(1);
    });

    it("Should calculate different yield rates based on stake amount", async function () {
      // Create two wells with different stake amounts
      await waterNFT.mintWell(addr1.address, "Test2", 1000, 500, "ipfs://test2");
      await chainlinkAutomation.addWellToAutomation(2);

      // Stake different amounts
      await mockToken.connect(addr1).approve(await stakingVault.getAddress(), ethers.parseEther("15000"));
      await stakingVault.connect(addr1).stake(2, ethers.parseEther("15000")); // High stake

      // Advance time and perform upkeep
      await time.increase(3601);
      await chainlinkAutomation.performUpkeep("0x");

      // Check that different yield rates are applied
      const rate1 = await stakingVault.getYieldRate(1); // Lower stake
      const rate2 = await stakingVault.getYieldRate(2); // Higher stake

      // Higher stakes should get lower rates (diminishing returns)
      expect(rate2).to.be.lessThan(rate1);
    });

    it("Should emit proper events during upkeep", async function () {
      await time.increase(3601);

      await expect(chainlinkAutomation.performUpkeep("0x"))
        .to.emit(chainlinkAutomation, "UpkeepPerformed")
        .and.to.emit(chainlinkAutomation, "YieldRateUpdated");
    });
  });

  describe("Configuration Management", function () {
    it("Should allow owner to update interval", async function () {
      const newInterval = 2 * 60 * 60; // 2 hours
      await chainlinkAutomation.setInterval(newInterval);
      expect(await chainlinkAutomation.interval()).to.equal(newInterval);
    });

    it("Should not allow non-owner to update interval", async function () {
      await expect(
        chainlinkAutomation.connect(addr1).setInterval(7200)
      ).to.be.revertedWithCustomError(chainlinkAutomation, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to update staking vault", async function () {
      const NewStakingVault = await ethers.getContractFactory("StakingVault");
      const newVault = await NewStakingVault.deploy(await mockToken.getAddress());

      await chainlinkAutomation.setStakingVault(await newVault.getAddress());
      expect(await chainlinkAutomation.stakingVault()).to.equal(await newVault.getAddress());
    });
  });
}); 