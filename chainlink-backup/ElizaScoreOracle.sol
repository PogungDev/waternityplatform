// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

// ElizaScoreOracle menyimpan skor dampak sosial untuk setiap sumur.
// Skor ini dapat diperbarui oleh AI off-chain (melalui Chainlink Functions)
// atau oleh entitas terpercaya (misal: pemilik kontrak).
contract ElizaScoreOracle is Ownable {
    // Mapping dari tokenId sumur ke skor dampaknya.
    mapping(uint256 => uint256) public impactScores;

    // Event untuk melacak pembaruan skor dampak.
    event ImpactScoreUpdated(uint256 indexed tokenId, uint256 newScore, uint256 timestamp);

    // Constructor: Pemilik kontrak diatur saat deployment.
    constructor() Ownable(msg.sender) {}

    // Fungsi untuk mengatur atau memperbarui skor dampak untuk sumur tertentu.
    // Hanya pemilik kontrak yang bisa memanggil ini.
    // Dalam skenario nyata, ini akan dipanggil oleh Chainlink Functions setelah
    // memproses data dari ElizaForecaster agent.
    function setScore(uint256 tokenId, uint256 newScore) external onlyOwner {
        require(newScore <= 1000, "ElizaScoreOracle: Score cannot exceed 1000"); // Batasi skor
        impactScores[tokenId] = newScore;
        emit ImpactScoreUpdated(tokenId, newScore, block.timestamp);
    }

    // Fungsi view untuk mendapatkan skor dampak sumur.
    function getScore(uint256 tokenId) external view returns (uint256) {
        return impactScores[tokenId];
    }
}
