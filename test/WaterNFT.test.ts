import { expect } from "chai"
import { ethers } from "hardhat"
import type { WaterNFT } from "../typechain-types"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("WaterNFT", () => {
  let waterNFT: WaterNFT
  let owner: SignerWithAddress
  let partner: SignerWithAddress
  let user: SignerWithAddress

  beforeEach(async () => {
    ;[owner, partner, user] = await ethers.getSigners()

    const WaterNFTFactory = await ethers.getContractFactory("WaterNFT")
    waterNFT = await WaterNFTFactory.deploy()
    await waterNFT.deployed()
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await waterNFT.owner()).to.equal(owner.address)
    })

    it("Should have correct name and symbol", async () => {
      expect(await waterNFT.name()).to.equal("WaterNFT")
      expect(await waterNFT.symbol()).to.equal("WATER")
    })
  })

  describe("Partner Authorization", () => {
    it("Should allow owner to authorize partners", async () => {
      await waterNFT.authorizePartner(partner.address)
      expect(await waterNFT.authorizedPartners(partner.address)).to.be.true
    })

    it("Should emit PartnerAuthorized event", async () => {
      await expect(waterNFT.authorizePartner(partner.address))
        .to.emit(waterNFT, "PartnerAuthorized")
        .withArgs(partner.address)
    })

    it("Should not allow non-owner to authorize partners", async () => {
      await expect(waterNFT.connect(user).authorizePartner(partner.address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      )
    })
  })

  describe("Well Minting", () => {
    beforeEach(async () => {
      await waterNFT.authorizePartner(partner.address)
    })

    it("Should allow authorized partner to mint well", async () => {
      const tx = await waterNFT
        .connect(partner)
        .mintWell(user.address, "Lombok, Indonesia", 5000, 250, "ipfs://test-uri")

      await expect(tx).to.emit(waterNFT, "WellMinted").withArgs(0, "Lombok, Indonesia", 5000, partner.address)

      expect(await waterNFT.ownerOf(0)).to.equal(user.address)
    })

    it("Should store well data correctly", async () => {
      await waterNFT.connect(partner).mintWell(user.address, "Lombok, Indonesia", 5000, 250, "ipfs://test-uri")

      const wellData = await waterNFT.getWellData(0)
      expect(wellData.location).to.equal("Lombok, Indonesia")
      expect(wellData.capacity).to.equal(5000)
      expect(wellData.peopleServed).to.equal(250)
      expect(wellData.isActive).to.be.true
      expect(wellData.fieldPartner).to.equal(partner.address)
    })

    it("Should not allow unauthorized address to mint", async () => {
      await expect(
        waterNFT.connect(user).mintWell(user.address, "Test Location", 1000, 50, "ipfs://test"),
      ).to.be.revertedWith("Not authorized partner")
    })

    it("Should increment token IDs correctly", async () => {
      await waterNFT.connect(partner).mintWell(user.address, "Location 1", 1000, 50, "ipfs://test1")

      await waterNFT.connect(partner).mintWell(user.address, "Location 2", 2000, 100, "ipfs://test2")

      expect(await waterNFT.ownerOf(0)).to.equal(user.address)
      expect(await waterNFT.ownerOf(1)).to.equal(user.address)
    })
  })

  describe("Well Status Updates", () => {
    beforeEach(async () => {
      await waterNFT.authorizePartner(partner.address)
      await waterNFT.connect(partner).mintWell(user.address, "Test Location", 1000, 50, "ipfs://test")
    })

    it("Should allow field partner to update well status", async () => {
      await waterNFT.connect(partner).updateWellStatus(0, false)
      const wellData = await waterNFT.getWellData(0)
      expect(wellData.isActive).to.be.false
    })

    it("Should allow owner to update well status", async () => {
      await waterNFT.connect(owner).updateWellStatus(0, false)
      const wellData = await waterNFT.getWellData(0)
      expect(wellData.isActive).to.be.false
    })

    it("Should not allow unauthorized address to update status", async () => {
      await expect(waterNFT.connect(user).updateWellStatus(0, false)).to.be.revertedWith("Not authorized")
    })
  })
})
