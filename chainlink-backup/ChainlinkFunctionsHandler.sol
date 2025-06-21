// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

// ChainlinkFunctionsHandler bertanggung jawab untuk memicu Chainlink Functions
// untuk mengambil prediksi debit air dari API eksternal.
contract ChainlinkFunctionsHandler is FunctionsClient, ConfirmedOwner {
    bytes32 public s_lastRequestId; // ID permintaan terakhir ke Chainlink Functions
    bytes public s_lastResponse; // Respons terakhir dari Chainlink Functions
    bytes public s_lastError; // Error terakhir dari Chainlink Functions

    // Event untuk melacak respons dari Chainlink Functions.
    event Response(bytes32 indexed requestId, bytes response, bytes err);
    // Event untuk melacak hasil prediksi debit air.
    event DebitsForecastReceived(uint256 indexed tokenId, uint256 predictedDebits, uint256 timestamp);

    // Constructor: Inisialisasi router Chainlink Functions dan pemilik kontrak.
    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    // Fungsi untuk mengirim permintaan ke Chainlink Functions untuk mengambil prediksi debit air.
    // Hanya pemilik kontrak yang bisa memanggil ini.
    function fetchDebitsForecast(
        uint64 subscriptionId, // ID langganan Chainlink Functions
        string[] calldata args, // Argumen untuk JavaScript sumber (misal: lokasi sumur)
        bytes calldata encryptedSecretsUrls, // URL rahasia terenkripsi (jika ada)
        uint8 donHostedSecretsSlotID, // Slot ID rahasia yang di-host DON
        uint64 donHostedSecretsVersion, // Versi rahasia yang di-host DON
        string calldata source, // Kode JavaScript sumber untuk Chainlink Functions
        uint256 tokenId // ID sumur yang relevan
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Inisialisasi permintaan dengan JavaScript sumber

        if (encryptedSecretsUrls.length > 0) {
            req.addSecretsReference(encryptedSecretsUrls);
        } else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(donHostedSecretsSlotID, donHostedSecretsVersion);
        }
        if (args.length > 0) {
            req.setArgs(args);
        }

        // Kirim permintaan ke Chainlink Functions.
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            300000, // gasLimit: Batas gas untuk eksekusi Functions
            0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000 // jobId untuk Arbitrum Sepolia (contoh)
        );

        // Simpan tokenId yang terkait dengan requestId ini.
        // Ini penting untuk memproses respons di fulfillRequest.
        // Anda mungkin perlu mapping requestToTokenId jika ada banyak permintaan bersamaan.
        // Untuk demo, kita asumsikan satu permintaan per waktu atau kelola di off-chain.
        // Untuk produksi, gunakan mapping: mapping(bytes32 => uint256) public requestToTokenId;
        // requestToTokenId[s_lastRequestId] = tokenId;

        return s_lastRequestId;
    }

    // Fungsi callback yang dipanggil oleh Chainlink Functions setelah eksekusi selesai.
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_lastResponse = response;
        s_lastError = err;
        
        // Emit event Response untuk melacak status permintaan.
        emit Response(requestId, s_lastResponse, s_lastError);

        if (err.length > 0) {
            // Handle error
            // console.log("Chainlink Functions error:", string(err));
            return;
        }

        // Parse respons (asumsi respons adalah uint256 debit air).
        // Dalam skenario nyata, Anda akan mendekode respons JSON atau CBOR.
        // Untuk demo, kita simulasikan parsing.
        uint256 predictedDebits = 0;
        if (response.length > 0) {
            // Contoh parsing sederhana: asumsikan respons adalah angka dalam bytes
            // Ini sangat disederhanakan untuk demo.
            // Di produksi, Anda akan menggunakan ABI.decode atau library parsing.
            predictedDebits = uint256(bytes32(response)); // Ini hanya contoh, tidak aman untuk produksi
            // Atau, jika respons adalah string angka:
            // predictedDebits = uint256(abi.decode(response, (uint256)));
        } else {
            // Jika tidak ada respons, berikan nilai default atau error
            predictedDebits = 1000 + (block.timestamp % 1000); // Dummy value
        }
        
        // Emit event dengan hasil prediksi debit air.
        // Anda perlu menyimpan tokenId yang terkait dengan requestId ini.
        // Jika Anda menggunakan mapping requestToTokenId, ambil tokenId di sini.
        // uint256 tokenId = requestToTokenId[requestId];
        // Untuk demo, kita asumsikan tokenId 1.
        emit DebitsForecastReceived(1, predictedDebits, block.timestamp);
    }
}
