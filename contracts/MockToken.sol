// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        // Mint 1 million tokens to deployer
        _mint(msg.sender, 1000000 * 10**6); // USDC has 6 decimals
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    // Allow anyone to mint for testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
} 