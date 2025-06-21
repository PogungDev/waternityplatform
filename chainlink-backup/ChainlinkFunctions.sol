// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract WaternityFunctions is FunctionsClient, ConfirmedOwner {
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    struct ForecastData {
        uint256 tokenId;
        uint256 predictedYield;
        uint256 impactScore;
        uint256 timestamp;
    }

    mapping(bytes32 => uint256) public requestToTokenId;
    mapping(uint256 => ForecastData) public forecasts;

    event Response(bytes32 indexed requestId, bytes response, bytes err);
    event ForecastUpdated(uint256 indexed tokenId, uint256 predictedYield, uint256 impactScore);

    constructor(address router) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    function sendRequest(
        uint64 subscriptionId,
        string[] calldata args,
        bytes calldata encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string calldata source,
        uint256 tokenId
    ) external onlyOwner returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);

        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            300000, // gasLimit
            0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000 // jobId for Arbitrum Sepolia
        );

        requestToTokenId[s_lastRequestId] = tokenId;
        return s_lastRequestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_lastResponse = response;
        s_lastError = err;
        
        uint256 tokenId = requestToTokenId[requestId];
        
        if (response.length > 0) {
            // Parse response (assuming JSON format)
            // For demo, we'll simulate parsing
            uint256 predictedYield = 250; // Simulated yield in basis points
            uint256 impactScore = 850; // Simulated impact score
            
            forecasts[tokenId] = ForecastData({
                tokenId: tokenId,
                predictedYield: predictedYield,
                impactScore: impactScore,
                timestamp: block.timestamp
            });

            emit ForecastUpdated(tokenId, predictedYield, impactScore);
        }

        emit Response(requestId, s_lastResponse, s_lastError);
    }

    function getForecast(uint256 tokenId) external view returns (ForecastData memory) {
        return forecasts[tokenId];
    }
}
