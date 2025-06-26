# Waternity Platform - Chainlink Hackathon Submission

🏆 **Platform pengelolaan sumur air menggunakan blockchain dan Chainlink smart contracts untuk Chromion Hackathon**

## 🔗 Chainlink Integration (HACKATHON REQUIREMENTS)

Proyek ini mengintegrasikan **3 layanan Chainlink utama** yang melakukan **state changes** di blockchain:

### 1. **Chainlink Automation** ⚡
- **File**: `contracts/ChainlinkAutomation.sol`
- **Fungsi**: Otomatis update yield rates untuk semua sumur
- **State Change**: `stakingVault.updateYieldRate()` dipanggil secara otomatis
- **Interval**: Setiap 1 jam (dapat dikonfigurasi)

### 2. **Chainlink Data Feeds** 📊
- **File**: `contracts/ChainlinkDataFeeds.sol`
- **Fungsi**: Update yield rates berdasarkan data pasar real-time (ETH/USD)
- **State Change**: `stakingVault.updateYieldRate()` berdasarkan harga market
- **Price Feed**: ETH/USD Sepolia testnet (`0x694AA1769357215DE4FAC081bf1f309aDC325306`)

### 3. **Chainlink Functions** 🌐
- **File**: `contracts/ChainlinkFunctions.sol`
- **Fungsi**: Verifikasi data sumur dari external API
- **State Change**: `waterNFT.updateWellStatus()` dan `wellRegistry.updateWellData()`
- **External Data**: Status operasional dan performa sumur

## 🚀 Quick Start with Chainlink

### Deployment Chainlink-Enabled
```bash
# Start local blockchain
npm run hardhat

# Deploy dengan Chainlink integration (Terminal baru)
npm run deploy:chainlink

# Start frontend
npm run dev
```

## 📄 Smart Contracts

### Core Contracts
- **WaterNFT**: NFT untuk representasi sumur air
- **WellRegistry**: Registry untuk tracking sumur
- **StakingVault**: Vault untuk staking dan reward distribution
- **WaternityRouter**: Router utama dengan Chainlink integration

### Chainlink Contracts ⭐
- **ChainlinkAutomation**: Otomatis yield distribution
- **ChainlinkDataFeeds**: Market-based yield calculation  
- **ChainlinkFunctions**: External data verification

## 🔑 Chainlink Contract Addresses

Setelah deployment, alamat contracts tersimpan di `deployed-addresses.json`:
```json
{
  "CHAINLINK_AUTOMATION": "0x...",
  "CHAINLINK_DATA_FEEDS": "0x...", 
  "CHAINLINK_FUNCTIONS": "0x..."
}
```

## 🌐 Network Support

- **Local Development**: Hardhat localhost:8545
- **Testnet**: Sepolia (dengan Chainlink oracles)
- **Mainnet**: Avalanche, Base (configured)

## 🎯 Key Features dengan Chainlink

1. **Automated Yield Distribution**: Chainlink Automation memastikan yield selalu up-to-date
2. **Market-Responsive Yields**: Data Feeds mengubah yield sesuai kondisi pasar
3. **Real-World Data Integration**: Functions memverifikasi status sumur dari external API
4. **Decentralized & Trustless**: Semua updates dilakukan secara otomatis tanpa human intervention

## 📋 Hackathon Compliance Checklist

- ✅ **Chainlink State Changes**: 3 layanan Chainlink melakukan state changes
- ✅ **Multiple Chainlink Services**: Automation + Data Feeds + Functions
- ✅ **Smart Contract Integration**: Terintegrasi dengan existing contracts
- ✅ **Testnet Deployment**: Ready untuk deploy ke Sepolia
- ✅ **Public Source Code**: Available di GitHub
- ✅ **Documentation**: README dengan Chainlink integration details

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Local blockchain
npm run hardhat

# Deploy dengan Chainlink (RECOMMENDED untuk hackathon)
npm run deploy:chainlink

# Deploy standard (tanpa Chainlink)
npm run deploy

# Start frontend
npm run dev
```

## 📍 Access Points

- **Frontend**: http://localhost:3333
- **Hardhat RPC**: http://localhost:8545
- **Blockchain Explorer**: Available via Hardhat node

## 🏗️ Architecture

```
WaternityRouter (Main Hub)
├── Core Contracts
│   ├── WaterNFT (Well NFTs)
│   ├── WellRegistry (Well Tracking)
│   └── StakingVault (Investment Logic)
└── Chainlink Integration ⭐
    ├── ChainlinkAutomation (Auto Updates)
    ├── ChainlinkDataFeeds (Market Data)
    └── ChainlinkFunctions (External Data)
```

## 🎬 Demo Functions

```javascript
// Stake dan enable automation
await router.stakeAndEnableAutomation(tokenId, amount)

// Update yields dengan market data
await router.updateYieldsWithMarketData([tokenId])

// Verifikasi well dengan external data  
await router.verifyWellWithExternalData(tokenId, subscriptionId, gasLimit, donID)

// Full onboarding dengan semua Chainlink services
await router.onboardWellWithChainlink(tokenId, amount, subscriptionId, gasLimit, donID)
```

## 🏆 Chainlink Hackathon Value Proposition

**Waternity Platform** mendemonstrasikan penggunaan **multiple Chainlink services** untuk menciptakan sistem pengelolaan sumur air yang:

1. **Fully Automated**: Chainlink Automation menjalankan maintenance tanpa human intervention
2. **Market Responsive**: Data Feeds membuat yield responsive terhadap kondisi ekonomi real-time  
3. **Data Verified**: Functions memastikan data sumur ter-verifikasi dari sumber eksternal
4. **Production Ready**: Architecture siap untuk real-world deployment

---

**Powered by Chainlink 🔗 | Built for Social Impact 💧 | Ready for Hackathon 🏆** 