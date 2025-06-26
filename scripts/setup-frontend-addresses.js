const fs = require('fs');
const path = require('path');

async function setupFrontendAddresses() {
  try {
    console.log("📋 Setting up frontend contract addresses...");
    
    // Read deployed addresses
    const deployedAddressesPath = path.join(__dirname, '..', 'deployed-addresses.json');
    if (!fs.existsSync(deployedAddressesPath)) {
      console.error("❌ deployed-addresses.json not found. Please deploy contracts first.");
      process.exit(1);
    }
    
    const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, 'utf8'));
    console.log("✅ Loaded deployed addresses:", deployedAddresses);
    
    // Read current .env file
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update environment variables
    const updates = {
      'NEXT_PUBLIC_WATER_NFT_ADDRESS': deployedAddresses.WaterNFT || '',
      'NEXT_PUBLIC_WELL_REGISTRY_ADDRESS': deployedAddresses.WellRegistry || '',
      'NEXT_PUBLIC_STAKING_VAULT_ADDRESS': deployedAddresses.StakingVault || '',
      'NEXT_PUBLIC_WATERNITY_ROUTER_ADDRESS': deployedAddresses.WaternityRouter || '',
      'NEXT_PUBLIC_MOCK_TOKEN_ADDRESS': deployedAddresses.MockToken || '',
      'NEXT_PUBLIC_CHAINLINK_AUTOMATION_ADDRESS': deployedAddresses.ChainlinkAutomation || '',
      'NEXT_PUBLIC_CHAINLINK_DATA_FEEDS_ADDRESS': deployedAddresses.ChainlinkDataFeeds || '',
      'NEXT_PUBLIC_CHAINLINK_FUNCTIONS_ADDRESS': deployedAddresses.ChainlinkFunctions || '',
    };
    
    console.log("🔄 Updating environment variables...");
    
    // Update each environment variable
    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${value}`;
      
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, newLine);
        console.log(`  ✅ Updated ${key}=${value}`);
      } else {
        envContent += `\n${newLine}`;
        console.log(`  ➕ Added ${key}=${value}`);
      }
    }
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Environment variables updated successfully!");
    
    // Copy addresses to public directory for frontend access
    const publicAddressesPath = path.join(__dirname, '..', 'public', 'deployed-addresses.json');
    fs.writeFileSync(publicAddressesPath, JSON.stringify(deployedAddresses, null, 2));
    console.log("✅ Copied addresses to public directory");
    
    console.log("\n🎉 Frontend setup complete!");
    console.log("💡 You can now run: npm run dev");
    console.log("🔗 Chainlink integration is ready!");
    
  } catch (error) {
    console.error("❌ Error setting up frontend addresses:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupFrontendAddresses();
}

module.exports = { setupFrontendAddresses }; 