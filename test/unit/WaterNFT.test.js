const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WaterNFT", function () {
  let waterNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get test accounts
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy WaterNFT contract
    const WaterNFT = await ethers.getContractFactory("WaterNFT");
    waterNFT = await WaterNFT.deploy();
    await waterNFT.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint a new well NFT", async function () {
      const location = "Jakarta, Indonesia";
      const capacity = 1000;
      const peopleServed = 500;
      const metadataURI = "ipfs://example";

      const tx = await waterNFT.mintWell(
        addr1.address,
        location,
        capacity,
        peopleServed,
        metadataURI
      );

      await tx.wait();

      // Verify NFT was minted
      expect(await waterNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await waterNFT.ownerOf(0)).to.equal(addr1.address); // tokenId starts from 0

      // Verify well data
      const wellData = await waterNFT.getWellData(0);
      expect(wellData.location).to.equal(location);
      expect(wellData.capacity).to.equal(capacity);
      expect(wellData.peopleServed).to.equal(peopleServed);
      expect(wellData.isActive).to.be.true;
    });

    it("Should increment total minted counter", async function () {
      expect(await waterNFT.getTotalMinted()).to.equal(0);

      await waterNFT.mintWell(
        addr1.address,
        "Test Location",
        1000,
        500,
        "ipfs://test"
      );

      expect(await waterNFT.getTotalMinted()).to.equal(1);
    });

    it("Should only allow owner or authorized partners to mint", async function () {
      await expect(
        waterNFT.connect(addr1).mintWell(
          addr1.address,
          "Test Location",
          1000,
          500,
          "ipfs://test"
        )
      ).to.be.revertedWith("WaterNFT: Not authorized partner or owner");
    });

    it("Should allow authorized partners to mint", async function () {
      // Authorize addr1 as partner
      await waterNFT.authorizePartner(addr1.address);
      
      // Now addr1 should be able to mint
      await waterNFT.connect(addr1).mintWell(
        addr2.address,
        "Partner Location",
        2000,
        1000,
        "ipfs://partner"
      );

      expect(await waterNFT.balanceOf(addr2.address)).to.equal(1);
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Mint a well first
      await waterNFT.mintWell(
        addr1.address,
        "Test Location",
        1000,
        500,
        "ipfs://test"
      );
    });

    it("Should allow owner to burn well", async function () {
      await waterNFT.connect(addr1).burnWell(0, "Test reason"); // tokenId starts from 0
      
      // Verify NFT was burned
      expect(await waterNFT.balanceOf(addr1.address)).to.equal(0);
      expect(await waterNFT.wellExists(0)).to.be.false;
    });

    it("Should not allow non-owner to burn well", async function () {
      await expect(
        waterNFT.connect(addr2).burnWell(0, "Test reason")
      ).to.be.revertedWith("WaterNFT: Not authorized to burn");
    });

    it("Should emit WellBurned event", async function () {
      await expect(waterNFT.connect(addr1).burnWell(0, "Test reason"))
        .to.emit(waterNFT, "WellBurned")
        .withArgs(0, addr1.address, "Test reason");
    });

    it("Should allow contract owner to emergency burn", async function () {
      await waterNFT.emergencyBurn(0, "Emergency reason");
      
      expect(await waterNFT.wellExists(0)).to.be.false;
    });

    it("Should not allow non-owner to emergency burn", async function () {
      await expect(
        waterNFT.connect(addr1).emergencyBurn(0, "Emergency")
      ).to.be.revertedWithCustomError(waterNFT, "OwnableUnauthorizedAccount");
    });
  });
}); 