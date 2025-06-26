// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// WaterNFT merepresentasikan setiap sumur air sebagai NFT unik.
// Metadata sumur (lokasi, kapasitas, dll.) disimpan on-chain.
contract WaterNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Struktur data untuk menyimpan informasi detail setiap sumur.
    struct WellData {
        string location;
        uint256 capacity; // kapasitas air per hari (liter)
        uint256 peopleServed; // jumlah orang yang dilayani
        bool isActive; // status operasional sumur
        address fieldPartner; // alamat mitra lapangan yang mendaftarkan sumur
        uint256 createdAt; // timestamp pendaftaran sumur
        string metadataURI; // URI ke metadata eksternal (misal: IPFS)
    }

    // Mapping dari tokenId ke data sumur.
    mapping(uint256 => WellData) public wells;
    // Mapping untuk melacak mitra lapangan yang berwenang untuk mint NFT.
    mapping(address => bool) public authorizedPartners;

    // Events untuk melacak aktivitas penting.
    event WellMinted(uint256 indexed tokenId, string location, uint256 capacity, address fieldPartner);
    event PartnerAuthorized(address indexed partner);
    event WellStatusUpdated(uint256 indexed tokenId, bool newStatus);
    event WellBurned(uint256 indexed tokenId, address burner, string reason);

    // Constructor: Inisialisasi nama dan simbol NFT.
    constructor() ERC721("WaterWellNFT", "WWNFT") Ownable(msg.sender) {}

    // Modifier untuk membatasi fungsi hanya untuk mitra yang berwenang atau pemilik kontrak.
    modifier onlyAuthorizedPartner() {
        require(authorizedPartners[msg.sender] || msg.sender == owner(), "WaterNFT: Not authorized partner or owner");
        _;
    }

    // Fungsi untuk memberikan otorisasi kepada alamat mitra lapangan. Hanya pemilik kontrak yang bisa memanggil ini.
    function authorizePartner(address partner) external onlyOwner {
        require(partner != address(0), "WaterNFT: Invalid address");
        authorizedPartners[partner] = true;
        emit PartnerAuthorized(partner);
    }

    // Fungsi untuk mencetak NFT sumur baru. Hanya mitra yang berwenang atau pemilik yang bisa memanggil ini.
    function mintWell(
        address to, // Alamat penerima NFT
        string memory location,
        uint256 capacity,
        uint256 peopleServed,
        string memory metadataURI // URI ke metadata NFT (misal: IPFS JSON)
    ) external onlyAuthorizedPartner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId); // Mint NFT ke alamat 'to'
        _setTokenURI(tokenId, metadataURI); // Set URI metadata untuk NFT

        // Simpan data sumur on-chain.
        wells[tokenId] = WellData({
            location: location,
            capacity: capacity,
            peopleServed: peopleServed,
            isActive: true, // Sumur baru secara default aktif
            fieldPartner: msg.sender, // Mitra yang mint adalah field partner
            createdAt: block.timestamp,
            metadataURI: metadataURI
        });

        emit WellMinted(tokenId, location, capacity, msg.sender);
        return tokenId;
    }

    // Fungsi untuk mendapatkan data sumur berdasarkan tokenId.
    function getWellData(uint256 tokenId) external view returns (WellData memory) {
        require(_ownerOf(tokenId) != address(0), "WaterNFT: Well does not exist");
        return wells[tokenId];
    }

    // Fungsi untuk memperbarui status operasional sumur (aktif/tidak aktif).
    // Hanya field partner yang mendaftarkan sumur atau pemilik kontrak yang bisa memanggil ini.
    function updateWellStatus(uint256 tokenId, bool newStatus) external {
        require(_ownerOf(tokenId) != address(0), "WaterNFT: Well does not exist");
        require(wells[tokenId].fieldPartner == msg.sender || msg.sender == owner(), "WaterNFT: Not authorized to update status");
        wells[tokenId].isActive = newStatus;
        emit WellStatusUpdated(tokenId, newStatus);
    }

    /**
     * @dev Burn/unmint a well NFT - Only owner or field partner can burn
     * @param tokenId The token ID to burn
     * @param reason Reason for burning (decommissioned, inactive, etc.)
     */
    function burnWell(uint256 tokenId, string memory reason) external {
        require(_ownerOf(tokenId) != address(0), "WaterNFT: Well does not exist");
        
        address tokenOwner = ownerOf(tokenId);
        address fieldPartner = wells[tokenId].fieldPartner;
        
        // Only token owner, field partner, or contract owner can burn
        require(
            msg.sender == tokenOwner || 
            msg.sender == fieldPartner || 
            msg.sender == owner(),
            "WaterNFT: Not authorized to burn"
        );

        // Store data before burning for event
        string memory location = wells[tokenId].location;
        
        // Clear well data
        delete wells[tokenId];
        
        // Burn the NFT
        _burn(tokenId);
        
        emit WellBurned(tokenId, msg.sender, reason);
    }

    /**
     * @dev Emergency burn function - Only owner can force burn
     * @param tokenId The token ID to burn
     * @param reason Emergency reason
     */
    function emergencyBurn(uint256 tokenId, string memory reason) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "WaterNFT: Well does not exist");
        
        // Clear well data
        delete wells[tokenId];
        
        // Burn the NFT
        _burn(tokenId);
        
        emit WellBurned(tokenId, msg.sender, reason);
    }

    /**
     * @dev Get total number of wells minted (including burned)
     */
    function getTotalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Check if a well exists
     */
    function wellExists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Revoke partner authorization
     */
    function revokePartner(address partner) external onlyOwner {
        authorizedPartners[partner] = false;
    }

    // Override fungsi tokenURI dari ERC721URIStorage.
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Override fungsi supportsInterface dari ERC721URIStorage.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
