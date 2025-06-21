const fs = require('fs');
const path = require('path');

// Function to update .env file with deployed contract addresses
function updateEnvFile(contracts) {
  const envPath = path.join(__dirname, '..', '.env');
  
  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update contract addresses
  Object.entries(contracts).forEach(([key, value]) => {
    const envKey = `NEXT_PUBLIC_${key}`;
    const regex = new RegExp(`^${envKey}=.*$`, 'm');
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${envKey}=${value}`);
    } else {
      envContent += `\n${envKey}=${value}`;
    }
  });
  
  // Write back to .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env file with contract addresses');
}

module.exports = { updateEnvFile }; 