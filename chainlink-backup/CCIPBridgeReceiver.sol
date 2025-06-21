// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// CCIPBridgeReceiver mensimulasikan penerimaan dana dari chain lain
// untuk tujuan donasi atau penambahan dana ke ekosistem Waternity.
// Ini adalah versi yang sangat disederhanakan dari fungsionalitas CCIP.
contract CCIPBridgeReceiver is Ownable {
    IERC20 public usdcToken; // Alamat token USDC yang akan diterima

    // Event untuk melacak dana yang diterima lintas-rantai.
    event CrossChainFundsReceived(
        bytes32 indexed messageId, // ID pesan dari CCIP (simulasi)
        uint64 indexed sourceChainSelector, // Selector chain asal (simulasi)
        address indexed sender, // Pengirim di chain asal (simulasi)
        uint256 tokenId, // ID sumur yang ditargetkan (jika ada)
        uint256 amount, // Jumlah dana yang diterima
        address tokenAddress // Alamat token yang diterima
    );

    // Constructor: Inisialisasi alamat token USDC.
    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    // Fungsi untuk mensimulasikan penerimaan dana lintas-rantai.
    // Dalam implementasi CCIP nyata, fungsi ini akan dipanggil oleh router CCIP.
    // Untuk demo, kita membuatnya dapat dipanggil oleh pemilik atau Eliza agent.
    function receiveCrossChainFunds(
        uint64 sourceChainSelector, // Contoh: 12532609583862156544 untuk Sepolia
        address sender, // Alamat pengirim di chain asal
        uint256 tokenId, // ID sumur yang ditargetkan (jika dana untuk sumur tertentu)
        uint256 amount // Jumlah dana yang diterima
    ) external onlyOwner { // Hanya pemilik yang bisa memicu simulasi ini
        require(amount > 0, "CCIPBridgeReceiver: Amount must be greater than 0");
        
        // Simulasi transfer dana ke kontrak ini.
        // Di CCIP nyata, token akan otomatis ditransfer ke kontrak ini.
        // Untuk demo, kita asumsikan dana sudah ada atau akan ditambahkan secara off-chain.
        // Atau, jika ini adalah kontrak yang menerima token, Anda akan memverifikasi transfer.
        
        // Emit event untuk mencatat penerimaan dana.
        emit CrossChainFundsReceived(
            bytes32(uint256(block.timestamp)), // Dummy messageId
            sourceChainSelector,
            sender,
            tokenId,
            amount,
            address(usdcToken)
        );
    }

    // Fungsi untuk memperbarui alamat token USDC. Hanya pemilik yang bisa memanggil.
    function setUsdcTokenAddress(address _newAddress) external onlyOwner {
        usdcToken = IERC20(_newAddress);
    }
}
