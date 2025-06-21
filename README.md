# Waternity Platform

Platform untuk pengelolaan sumur air menggunakan blockchain dan smart contracts.

## 🚀 Quick Start

### Cara Mudah (Recommended)
```bash
./start-local.sh
```
Script ini akan otomatis:
- Install dependencies
- Start Hardhat local blockchain
- Deploy smart contracts
- Start Next.js frontend di port 3333

### Cara Manual

1. **Install dependencies**
```bash
npm install
```

2. **Start Hardhat node** (Terminal 1)
```bash
npm run hardhat
```

3. **Deploy contracts** (Terminal 2)
```bash
npm run deploy
```

4. **Start frontend** (Terminal 2)
```bash
npm run dev
```

## 📍 Akses Aplikasi

- Frontend: http://localhost:3333
- Hardhat RPC: http://localhost:8545

## 🔧 Port Configuration

Aplikasi ini menggunakan port 3333 (bukan default 3000) untuk persiapan Docker deployment.

## 📄 Smart Contracts

- **WaterNFT**: NFT untuk representasi sumur air
- **WellRegistry**: Registry untuk tracking sumur
- **StakingVault**: Vault untuk staking dan reward distribution
- **WaternityRouter**: Router utama untuk interaksi

## 🗂️ Struktur Project

```
waternityplatform/
├── app/              # Next.js app directory
├── contracts/        # Smart contracts
├── scripts/          # Deployment scripts
├── components/       # React components
├── lib/             # Utility functions
└── public/          # Static assets
```

## 🔑 Test Accounts

Hardhat menyediakan test accounts dengan ETH untuk testing. Private key pertama:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 🐛 Troubleshooting

Jika ada masalah:
1. Pastikan port 3333 dan 8545 tidak digunakan
2. Hapus `node_modules` dan install ulang
3. Check `hardhat.log` untuk error blockchain 